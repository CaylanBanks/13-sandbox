/***************************************************************/
//gtnGame.js
//Written by Caylan Banks 2024/2025
//Code for the Guess the Number game
/**************************************************************/
console.log("%c gtnGame.js", "color:green");
const displayName = sessionStorage.getItem("user.displayName");




function updateLobbyUI() {
    const userId = sessionStorage.getItem("user.uid");
    const displayName = sessionStorage.getItem("user.displayName");
    const gameDisplay = document.getElementById("gameDisplay");

    // Listen for waiting games
    firebase.database().ref('/waitingGames').once('value', (snapshot) => {
        const games = snapshot.val();
        gameDisplay.innerHTML = ""; // Clear previous content

        if (!games) {
            // No waiting games, show create button
            gameDisplay.innerHTML = `<button id="createGameButton" onclick="gtn_createGame()">Create Game</button>`;
        } else {
            // There are waiting games, show join buttons for each (except your own)
            let foundOtherGame = false;
            Object.keys(games).forEach((key) => {
                if (key !== userId) {
                    foundOtherGame = true;
                    gameDisplay.innerHTML += `<button onclick="gtn_joinGame('${key}')">Join ${games[key]}'s game</button><br>`;
                }
            });
            if (!foundOtherGame) {
                // Only your own game is waiting, show waiting message
                gameDisplay.innerHTML = `<div id="waitingMessage">Waiting for others to join...</div>`;
            }
        }
    });
}


/**************************************************************/
// gtn_createGame()
// Called by gtnlobby.html
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/

function gtn_createGame() {
    console.log("%c gtn_createGame()", "color:green");
     const userId = sessionStorage.getItem("user.uid");

console.log("Game ID:", userId);
    // Hide the "Create Game" buttonsa
    const createGameButton = document.getElementById("createGameButton");
    createGameButton.style.display = "none";

    // Show the "Waiting for others to join" message
    const waitingMessage = document.getElementById("waitingMessage");
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
function gtn_joinGame(userId) { 
    console.log("%c gtn_joinGame()", "color:green");
     const userId = sessionStorage.getItem("user.uid");
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

document.addEventListener("DOMContentLoaded", updateLobbyUI);