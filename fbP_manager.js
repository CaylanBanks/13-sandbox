/***************************************************************/
// fbP_manager.js
// Read & write to Firebase
// Written by Caylan Banks Term 2 2024
/**************************************************************/

console.log("%c fbP_manager.js", "color:blue");

fbP_initialize();
/**************************************************************/
// fbP_initialise()
// Called by fbP_manager.js
// Initilizes the database 
// Input:  n/a
// Return: n/a
/**************************************************************/
function fbP_initialize() {
  console.log('fbP_initialise()');

  if (typeof firebase === 'undefined') {
      console.error("Firebase SDK not loaded properly.");
      return;
  }


 const FIREBASECONFIG = {
  apiKey: "AIzaSyBTotozJ_MhOZ3kesJwnMzgQ15oqUVHVHo",
  authDomain: "comp-2025-caylan-banks.firebaseapp.com",
  databaseURL: "https://comp-2025-caylan-banks-default-rtdb.firebaseio.com",
  projectId: "comp-2025-caylan-banks",
  storageBucket: "comp-2025-caylan-banks.firebasestorage.app",
  messagingSenderId: "515643998293",
  appId: "1:515643998293:web:4a5c7f1dd191b637e3d4dc",
  measurementId: "G-92D1R4GW3P"
};
  console.log("firebase.initializeApp(FIREBASECONFIG);")

  // Check if firebase has already been initialized
  if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASECONFIG);
      database = firebase.database();
      console.log("Firebase initialized successfully.");
  } else {
      console.log("Firebase already initialized.");
  }
}

/**************************************************************/
// fbP_procLogin()
// Process login result
// Input: loginStatus, save object, user object, error object
/**************************************************************/
function fbP_procLogin(_loginStatus, _save, _user, _error) {
  console.log("fbP_procLogin(): status = " + _loginStatus);
  if (_loginStatus === "error") {
    console.error("Login error: " + _error.code + " " + _error.message);
    alert("Login failed: " + _error.message);
  } else {
    _save.uid = _user.uid;
    _save.email = _user.email;
    _save.displayName = _user.displayName;
    _save.photoURL = _user.photoURL;
    _save.emailVerified = _user.emailVerified;

    // Save user details to session storage
    sessionStorage.setItem("uid", _user.uid);
    sessionStorage.setItem("email", _user.email);
    sessionStorage.setItem("displayName", _user.displayName);
    sessionStorage.setItem("photoURL", _user.photoURL);
    sessionStorage.setItem("loginStatus", _loginStatus);

    console.log("User details saved to sessionStorage: " + JSON.stringify(_save));
    fb_writeRec('users', _save.uid, _save, fbP_procWriteRec);
  }
}



/**************************************************************/
// fbP_procReadRec()
// Process read result
// Input: DB path, key, save object, error
/**************************************************************/
function fbP_procReadRec(_path, _key, _save, _error) {
  console.log("fbP_procReadRec()");

  if (_error) {
    console.error(`Error reading from ${_path}/${_key}:`, _error);
    alert("Read failed. See console log for details.");
  } else {
    console.log(`Successfully read from ${_path}/${_key}:`, _save);
  }
}
/**************************************************************/
// fbP_procWriteRec()
// Process write result
// Input: DB path, key, data, error
/**************************************************************/
function fbP_procWriteRec(_path, _key, _data, _error) {
  console.log("fbP_procWriteRec()");

  if (_error) {
    console.error(`Error writing to ${_path}/${_key}:`, _error);
    alert("Write failed. See console log for details.");
  } else {
    console.log(`Successfully wrote to ${_path}/${_key}`);
  }
}