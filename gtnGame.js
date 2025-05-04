/***************************************************************/
//gtnGame.js
//Written by Caylan Banks 2024/2025
//Code for the Guess the Number game
/**************************************************************/

// gtn_createGame()
// Called by gtnlobby.html
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/
function gtn_createGame() {
    console.log("gtn_createGame");

    // Hide the "Create Game" button
    const createGameButton = document.getElementById("createGameButton");
    createGameButton.style.display = "none";

    // Show the "Waiting for others to join" message
    const waitingMessage = document.getElementById("waitingMessage");
    waitingMessage.style.display = "block";

    // Firebase logic to create the game
    const userId = sessionStorage.getItem("user.uid");
    const displayName = sessionStorage.getItem("user.displayName");

    // Add the game to the waitingGames list
    firebase.database().ref('/waitingGames/' + userId).set(displayName, (error) => {
        if (error) {
            console.error("Error creating game:", error);
        } else {
            console.log("Game created by:", displayName);
        }
    });

    // Set up the game in progress
    const gameId = userId;
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    firebase.database().ref('/gamesInProgress/' + gameId).set({
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



// gtn_joinGame()
// Called by ????
// Input:  User clicks button
// Return: Creates a game and adds it to the waitingGames list
/**************************************************************/
function gtn_joinGame(gameId) {
    console.log("gtn_joinGame");

    const userId = sessionStorage.getItem("user.uid");
    const displayName = sessionStorage.getItem("user.displayName");

    // Remove the game from the waitingGames list
    firebase.database().ref('/waitingGames/' + gameId).remove();

    // Update the game in progress
    firebase.database().ref('/gamesInProgress/' + gameId).update({
        P2: userId,
        activePlayer: "P2",
        [userId]: {
            name: displayName,
            guess: "no guess yet",
            result: ""
        }
    }).then(() => {
        console.log("Joined game as challenger.");
    });
}

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

