/***************************************************************/
//gtnGame.js
//Written by Caylan Banks 2024/2025
//Code for the Guess the Number game
/**************************************************************/
console.log("%c gtnGame.js", "color:green");
const displayName = sessionStorage.getItem("user.displayName");


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
    // Hide the "Create Game" button
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