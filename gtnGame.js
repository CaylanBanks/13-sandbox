/***************************************************************/
//gtnGame.js
//Written by Caylan Banks 2024/2025
//Code for the Guess the Number game
/**************************************************************/
console.log("%c gtnGame.js", "color:green");
waitingMessage.style.display = "none";
window.addEventListener("load", gtn_checkForWaitingGames);
  
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

    firebase.database().ref('/waitingGames/').once('value')
        .then(snapshot => {
            const games = snapshot.val();

            if (games && Object.keys(games).length > 0) {
                // At least one waiting game found
                console.log("Waiting game(s) found:", games);
                joinGameButton.style.display = "block";
                createGameButton.style.display = "none";
            } else {
                // No waiting games
                console.log("No waiting games found.");
                createGameButton.style.display = "block";
                joinGameButton.style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error checking for waiting games:", error);
        });
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
    console.log("Game setup complete. Waiting for a challenger...");
});

}

/**************************************************************/
// gtn_createGame()
// Called by gtnlobby.html
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/
function gtn_joinGame() { 
    console.log("%c gtn_joinGame()", "color:green");

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
