/***************************************************************/
// fb_io.js
// Written by Caylan Banks 2024/2025
//read & write to firebase
//Handle login
/**************************************************************/

console.log("%c fb_io.js", "color:green");


const firebaseConfig = {
  apiKey: "AIzaSyBTotozJ_MhOZ3kesJwnMzgQ15oqUVHVHo",
  authDomain: "comp-2025-caylan-banks.firebaseapp.com",
  databaseURL: "https://comp-2025-caylan-banks-default-rtdb.firebaseio.com",
  projectId: "comp-2025-caylan-banks",
  storageBucket: "comp-2025-caylan-banks.firebasestorage.app",
  messagingSenderId: "515643998293",
  appId: "1:515643998293:web:4a5c7f1dd191b637e3d4dc",
  measurementId: "G-92D1R4GW3P"
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);



/**************************************************************/
// fb_login(_save,_user)
// Handles login and checks if the user is registered
/**************************************************************/
function fb_login(_save, _user, _procFunc) {
  console.log('fb_login() called');
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
      if (user) {
          console.log("User logged in:", user);
          loginStatus = 'logged in';

          // Save user details in session storage
          sessionStorage.setItem("user.uid", user.uid);
          sessionStorage.setItem("user.displayName", user.displayName);
          sessionStorage.setItem("user.email", user.email);
          sessionStorage.setItem("user.photoURL", user.photoURL);

          // Check if the user already exists in the database
          firebase.database().ref("users/" + user.uid).once("value", (snapshot) => {
              console.log("Checking if user is registered...");
              console.log("Database snapshot:", snapshot.val());

              if (snapshot.exists()) {
                  console.log("User is registered:", snapshot.val());

                  // User is registered, no redirection needed
                  alert("Welcome back, " + user.displayName + "!");
                  window.location.href = "gamepage.html"; // Redirect to the game page
                  if (_procFunc) {
                      _procFunc(loginStatus, user, _save);
                  }
              } else {
                  console.log("New user detected. Redirecting to registration...");
                  window.location.href = "registration.html"; // Redirect to registration page
              }
          }).catch((error) => {
              console.error("Error checking user registration:", error.message);
              alert("An error occurred while checking registration. Please try again.");
          });
      } else {
          console.log("User not logged in. Redirecting to Google login...");
          loginStatus = 'logged out';

          var provider = new firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({
              prompt: 'select_account'
          });

          firebase.auth().signInWithPopup(provider)
              .then(function (result) {
                  console.log("Login successful via popup:", result.user);
                  loginStatus = 'logged in via popup';

                  // Check if the user is registered after login
                  newLogin(result.user);
              })
              .catch(function (error) {
                  console.error("Login error:", error.message);
                  loginStatus = 'error';
                  alert("Login failed: " + error.message);
                  if (_procFunc) {
                      _procFunc(loginStatus, null, _save, error);
                  }
              });
      }
  }
}


/**************************************************************/
// fb_registerUser(name, age)
// Called by registration page
// Input:  User's name and age
// Return: n/a
/**************************************************************/
function fb_registerUser(name, age) {
  console.log("fb_registerUser() called");
  const userId = sessionStorage.getItem("user.uid");

  if (!userId) {
      alert("Error: User not logged in. Please log in first.");
      window.location.href = "login.html"; // Redirect to login page
      return;
  }

  // Retrieve existing user details from session storage
  const displayName = sessionStorage.getItem("user.displayName");
  const email = sessionStorage.getItem("user.email");
  const photoURL = sessionStorage.getItem("user.photoURL");

  // Prepare the data to update
  const userData = {
      name: name,
      age: age,
      displayName: displayName,
      email: email,
      photoURL: photoURL
  };

  // Save user details in Firebase Realtime Database
  firebase.database().ref("users/" + userId).update(userData)
      .then(() => {
          alert("Registration successful! You can now play the games.");
          window.location.href = "gamepage.html"; // Redirect to the game page
      })
      .catch((error) => {
          console.error("Error during registration:", error.message);
          alert(error.message);
      });
}

/**************************************************************/
// fb_readRec(_path,_key,_save,_procFunc)
// Called by ?????
// Read a record from a db
// Input:  DB path and key, data to write,
//Function to process the result of the read
// Return: n/a
/**************************************************************/
//fb_readRec('admin', 'aaa', adminData);
  function fb_readRec(_path, _key, _save, _procFunc) {
    console.log("fb_readRec():" + _path + " key=" + _key);
    firebase
        .database()
        .ref(_path + "/" + _key)
        .once("value")
        .then((snapshot) => {
            const dbData = snapshot.val();
            _procFunc(_path, _key, dbData, null);
        })
        .catch((_error) => {
            console.error("Database read _error:", _error);
            _procFunc(_path, _key, _save, _error);
        });
}


/**********************************************************/
// fb_writeRec(_path,_key,_data,_procFunc)
// Called by fbP_procLogin
// Write rec to db
// Input:  n/a
// Return: n/a
/**********************************************************/
//fb_writeRec('admin', 'aaa', adminData, _procFunc)
function fb_writeRec(_path, _key, _data, _procFunc) {
  console.log("fb_writeRec(): _data =", _data);

  

  if (!_data.uid || !_data.displayName || !_data.email || _data.photoURL) {
    console.error("Invalid or incomplete data:", _data);  
      _procFunc(_path, _key, _data, new Error("Invalid data"));
      return;
    }
  
    console.log(
      `fb_writeRec(): path= ${_path} key= ${_key} data= ${_data.uid}/${_data.displayName}/${_data.email}`
    );
    
    firebase.database().ref(_path + "/" + _key).set(_data, (error) => {
      if (error) {
        _procFunc(_path, _key, _data, error);
      } else {
        _procFunc(_path, _key, _data, null);
      }
      console.log("fb_writeComplete: exit");
    });
  }

