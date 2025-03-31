/***************************************************************/
// gtnLobby.js
// Written by Caylan Banks 2024/2025
//read & write to firebase
/**************************************************************/
console.log("%c gtnLobby.js", "color:green");

var activeLobby = false;
var lobbyRef = firebase.database().ref("lobby"); // Reference to the lobby in Firebase

checkLobby();

// Listen for changes in the lobby status in Firebase
lobbyRef.on("value", function (snapshot) {
    const lobbyData = snapshot.val();
    if (lobbyData && lobbyData.active) {
        activeLobby = true;
        checkLobby(); // Update the UI when the lobby status changes
    } else {
        activeLobby = false;
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

    if (activeLobby === false) {
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
            activeLobby = true; // Update lobby status locally
            lobbyRef.set({ active: true }); // Update lobby status in Firebase
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