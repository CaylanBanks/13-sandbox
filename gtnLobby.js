/***************************************************************/
// gtnLobby.js
// Written by Caylan Banks 2024/2025
//read & write to firebase
/**************************************************************/
console.log("%c gtnLobby.js", "color:green");
var user = sessionStorage.getItem('user.uid');
var activeLobby = "none";
var lobbyRef = firebase.database().ref("lobby"); // Reference to the lobby in Firebase



// Listen for changes in the lobby status in Firebase
lobbyRef.on("value", function (snapshot) {
    const lobbyData = snapshot.val();
    if (lobbyData !== "none") {
        activeLobby = user.uid;
        checkLobby(); // Update the UI when the lobby status changes
    } else {
        activeLobby = "none";
        checkLobby(); // Update the UI when the lobby status changes
    }
});

function checkLobby() {
    console.log("checkLobby()");

    // Create or update a status text element
    let statusText = document.getElementById("lobbyStatus");
    if (!statusText) {
        statusText = document.createElement("p");
        statusText.id = "lobbyStatus";
        statusText.style.fontSize = "18px";
        document.body.appendChild(statusText);
    }

    if (activeLobby === "none") {
        console.log("lobby not active");
        statusText.textContent = "There aren't any lobbies active.";

        // Create a button to create a lobby
        const button = document.createElement("button");
        button.textContent = "Create Lobby";
        button.style.padding = "10px 20px";
        button.style.fontSize = "16px";

        // Add a click event listener to the button
        button.addEventListener("click", function () {
            console.log("Lobby created!");
            activeLobby = user.uid; // Update lobby status locally
            lobbyRef.set({ active: user.uid }); // Update lobby status in Firebase
            gtn_createGame();
            checkLobby(); // Re-run checkLobby to update the UI
        });

        // Append the button to the body or a specific container
        document.body.appendChild(button);
    } else {
        console.log("lobby active");
        statusText.textContent = "Waiting for others to join...";

        // Update the UI for other users
        let joinButton = document.getElementById("joinLobbyButton");
        if (!joinButton) {
            joinButton = document.createElement("button");
            joinButton.id = "joinLobbyButton";
            joinButton.textContent = "Join Other Game";
            joinButton.style.padding = "10px 20px";
            joinButton.style.fontSize = "16px";

            // Add a click event listener to the join button
            joinButton.addEventListener("click", function () {
                console.log("Joining the lobby...");
                alert("You joined the lobby!");
            });

            // Append the join button to the body or a specific container
            document.body.appendChild(joinButton);
        }
    }
}

function gtn_createGame() {
    console.log("gtn_createGame");
// Stop listening for other waiting games
firebase.database().ref('/waitingGames').off();

// add the current user to the waiting games
firebase.database().ref('/waitingGames/' + user.uid).set(user.displayName, function(error) {
    if (error) {
        console.error("Error creating waiting game:", error);
    } else {
        console.log("Waiting game created for user:", user.displayName);
    }
});

//Set up the game in progress
gameID = user.uid;// Use the user's UID as the game ID
firebase.database().ref('/gamesInProgress/;' + gameID + '/').set({
    P1: user.uid,
    lastTurn: user.uid,
    [user.uid]: { name: user.displayName, guess: "no guess yet", result: " "},
}).then(() => {
    console.log("Game created with ID:", gameID);
    gtn_startGame(gameID, "gameOwner")
})


}


function gtn_startGame(gameID, role) {
    console.log("Game started with ID:", gameID, "Role:", role);
    // Add logic to start the game (e.g., navigate to the game screen, initialize game state, etc.)
}