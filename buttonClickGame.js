console.log("%c buttonClickGame", "color: green;");

let sec = 0
var p_timer;
var intvTimer;
bcScore = sec;
timerFunc();   
var user = sessionStorage.getItem('user.uid');
console.log('user: ' + user);

/**********************************************************/
// timerFunc
// Called by setup
// Create timer
// Input:  n/a
// Return: n/a
/**********************************************************/

function setup() {
    alert('click the button')
   p_timer = setInterval(timerFunc, 1000);
}

function timerFunc() {
    console.log("Timer running")
    sec++;
    console.log("time: " + sec);

}

function buttonClicked() {
alert("You clicked the button in " + sec + " seconds");
 // write users score for guess the number game to database
        firebase.database().ref("users/" + user ).update (
          {
             score: sec
          }
       )
}

function draw() {
    console.log("time: " + sec);
}

