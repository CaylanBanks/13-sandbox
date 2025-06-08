/***************************************************************/
//gtnGame.js
//Written by Caylan Banks 2024/2025
//Code for the Guess the Number game
/**************************************************************/
console.log("%c gtnGame.js", "color:green");
waitingMessage.style.display = "none";
gtn_checkForWaitingGames(); // Check for waiting games on page load

const userId = sessionStorage.getItem("user.uid");
const displayName = sessionStorage.getItem("user.displayName");

/**************************************************************/
// gtn_checkForWaitingGames()
// Called on page load or refresh
// Input:  None
// Return: Shows appropriate button based on game availability
/**************************************************************/
function gtn_checkForWaitingGames() {
    console.log("%c gtn_checkForWaitingGames()", "color:blue");

    const createGameButton = document.getElementById("createGameButton");
    const joinGameButton = document.getElementById("joinGameButton");
    
    const waitingGamesref = firebase.database().ref('/waitingGames/');
    const listener = waitingGamesref.on('value', (snapshot) => {
        const games = snapshot.val();


        if (games && Object.keys(games).length > 0) {
            // At least one waiting game found
            console.log("Waiting game(s) found:", games);
            joinGameButton.style.display = "block";
            createGameButton.style.display = "none";
            // Turn off the listener
            waitingGamesref.off('value', listener); // Remove the listener after checking
            
        } else {
            // No waiting games
            console.log("No waiting games found.");
            createGameButton.style.display = "block";
            joinGameButton.style.display = "none";
        }
    
   
})
}
/**************************************************************/
// gtn_createGame()
// Called by gtnlobby.html
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/

function gtn_createGame() {
    console.log("%c gtn_createGame()", "color:orange");
    if (!userId || !displayName) {
        console.error("User ID or display name not found in session storage.");
        return;
    }
    const createGameButton = document.getElementById("createGameButton");
    const waitingMessage = document.getElementById("waitingMessage");

console.log("Game ID:", userId);
    // Hide the "Create Game" buttons
    createGameButton.style.display = "none";
    
    // Show the "Waiting for others to join" message

    waitingMessage.style.display = "block";



    // Write to firebase that there is a waiting game
    firebase.database().ref('/waitingGames/' + userId).set(displayName, (error) => {
        if (error) {
            console.error("Error creating game:", error);
        } else {
            console.log("Game created by:", displayName);
        }
    });

    
joinGameButton.style.display = "none";
    //Create the random number
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    //write to the firebase the random number, the user id
    // sets P1 as the active player with the next guess
    firebase.database().ref('/gamesInProgress/' + userId).set({
    number: randomNumber,         
    P1: userId,                   
    activePlayer: "P1",           
    [userId]: {                   
        name: displayName,        
        guess: "no guess yet",    
        result: ""                
    }
}).then(() => {
    gtn_checkForChallenger(); // Check for challengers after creating the game
    console.log("Game setup complete. Waiting for a challenger...");
   
});

}

/**************************************************************/
// gtn_checkForChallenger()
// Called by gtnlobby.html
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/
function gtn_checkForChallenger() {

    console.log("%c gtn_checkForChallenger()", "color:purple");
    const waitingGamesRef = firebase.database().ref('/waitingGames/');
    const listener = waitingGamesRef.on('value', snapshot => {
        const gameData = snapshot.val();

        if (gameData && gameData.P2) {
            console.log("Challenger found:", gameData.P2);

            // turn off the listener
            waitingGamesRef.off('value', listener);
            gtn_startGame;
        }
        else {
            console.log("No challenger found");
        }
})
       
    }
/**************************************************************/
// gtn_joinGame
// Called by gtnlobby.html
// Input:  User clicks button
// Return: User joins a waiting game
/**************************************************************/
function gtn_joinGame() { 
    console.log("%c gtn_joinGame()", "color:green");
joinGameButton.style.display = "none";
    // Remove the game from the waitingGames list
    firebase.database().ref('/waitingGames/' + userId).remove();


    // Update the game in progress
    firebase.database().ref('/gamesInProgress/' + userId).update({
        P2: userId,
        activePlayer: "P2",  // this might be incorrect as p1 should still be active because they haven't guessed yet
        [userId]: {
            name: displayName,
            guess: "no guess yet",
            result: ""
        }
    }).then(() => {
        console.log("Joined game as challenger.");
    });

}


function gtn_startGame() {
    console.log("%c gtn_startGame()", "color:purple");
}
// gtn_makeGuess()
// Called by ????
// Input:  User types in a number (a guess)
// Return: User is told if the guess is too high, too low, or correct
/**************************************************************/
function gtn_makeGuess(guess) {
    console.log("gtn_makeGuess");

    const gameId = sessionStorage.getItem("gameId");
    const userId = sessionStorage.getItem("user.uid");

    firebase.database().ref('/gamesInProgress/' + gameId).once('value', (snapshot) => {
        const gameData = snapshot.val();
        const number = gameData.number;

        let result = "";
        if (guess < number) {
            result = "too low";
        } else if (guess > number) {
            result = "too high";
        } else {
            result = "win";
            gtn_updateScore(gameId, userId);
        }

        const updates = {};
        updates[userId + "/guess"] = guess;
        updates[userId + "/result"] = result;
        updates["activePlayer"] = gameData.activePlayer === "P1" ? "P2" : "P1";

        firebase.database().ref('/gamesInProgress/' + gameId).update(updates);
    });
}

function gtn_updateScore(gameId, winnerId) {
    console.log("gtn_updateScore");

    firebase.database().ref('/gamesInProgress/' + gameId).once('value', (snapshot) => {
        const gameData = snapshot.val();
        const loserId = gameData.P1 === winnerId ? gameData.P2 : gameData.P1;

        const updates = {};

        // Update winner's score
        firebase.database().ref('/gameScores/' + winnerId).once('value', (winnerSnapshot) => {
            const winnerData = winnerSnapshot.val() || { wins: 0, losses: 0 };
            updates[winnerId] = {
                name: gameData[winnerId].name,
                wins: winnerData.wins + 1,
                losses: winnerData.losses
            };

            // Update loser's score
            firebase.database().ref('/gameScores/' + loserId).once('value', (loserSnapshot) => {
                const loserData = loserSnapshot.val() || { wins: 0, losses: 0 };
                updates[loserId] = {
                    name: gameData[loserId].name,
                    wins: loserData.wins,
                    losses: loserData.losses + 1
                };

                // Save updates to Firebase
                firebase.database().ref('/gameScores').update(updates);
            });
        });
    });
}
