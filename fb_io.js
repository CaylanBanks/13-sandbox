/***************************************************************/
// fb_io.js
//read & write to firebase
// Written by Caylan Banks 2025
/**************************************************************/

console.log("%c fb_io.js", "color:blue");


const firebaseConfig = {
    apiKey: "AIzaSyByB-WJsNPQEDK7SZ3dXrPMEUJ8aUpaaAg",
    authDomain: "comp-2025-caylan-banks.firebaseapp.com",
    databaseURL: "https://comp-2024-caylan-banks-default-rtdb.firebaseio.com",
    projectId: "comp-2025-caylan-banks",
    storageBucket: "comp-2025-caylan-banks.firebasestorage.app",
    messagingSenderId: "727244724088",
    appId: "1:727244724088:web:9c528f0677ca9f00bc5a8d",
    measurementId: "G-H9NDB7QELM"
  };

/**************************************************************/
// fb_login(_save,_procFunc)
// Called by various
// Input:  User logs in
// Return: n/a
/**************************************************************/
 function fb_login(_save, _procFunc) {
    console.log('fb_login() ');
    firebase.auth().onAuthStateChanged(newLogin);
  
    function newLogin(user) {
     let loginStatus;
      if (user) {
        // user is signed in, so call function to process login data
        loginStatus = 'logged in';
        _procFunc(loginStatus, user, _save, null);
      } 
      else {
        // user NOT logged in, so redirect to Google login
        loginStatus = 'logged out';
        console.log('fb_login(): status = ' + loginStatus);
  
        var provider = new firebase.auth.GoogleAuthProvider();
        /* To force Google sign to ask which account to use:
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        */
        firebase.auth().signInWithPopup(provider).then(function(result) {
          loginStatus = 'logged in via popup';
          _procFunc(loginStatus, result.user, _save);
        })
        // Catch errors
        .catch(function(error) {
          loginStatus = 'error';
          _procFunc(loginStatus, null, _save, error);
        });
      }
    }
   
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
// Called by ?????
// Write rec to db
// Input:  n/a
// Return: n/a
/**********************************************************/
//fb_writeRec('admin', 'aaa', adminData, _procFunc)
function fb_writeRec(_path, _key, _data, _procFunc) {
  console.log("fb_writeRec(): _data =", _data);

  if (!_data.uid || !_data.displayName || !_data.email) {
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

