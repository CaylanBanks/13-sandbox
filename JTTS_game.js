//program by Caylan Banks
//Jump to the Sky game, vertical platformer game where you have 
//to parkour to reach the top


console.log("%c JTTS_game.js", "color: green;");



// variables
let frogSpriteImage;
let frog;
let cnv;
let tileSheetImage;
let grass;
let finishBlock;
let lavaBlock;
let sec = 0
let gameEnd = false;
let intvTimer;


//constants
const PLAYERRADIUS = 100;
const PLAYERVISUALSIZE = 80;

//Functions
function preload() {
    console.log("preload: ");
    frogSpriteImage = loadImage("Images/frog.jfif");
    tileSheetImage = loadImage("Images/tilesheet.png");
}

function jttsSetup() {
    console.log("jttsSetup: ");
    console.log(
        "Canvas Created, dimensions: (w/h)" + windowWidth + "/" + windowHeight
    );
    //gravity
    world.gravity.y = 8;
    
    //timer
   //  p_timer.textContent = 'time: ' + sec;
    
    //frog creation
    cnv = new Canvas(windowWidth, (windowHeight - 176));
    frog = new Sprite(windowWidth / 2, windowHeight / 2, PLAYERVISUALSIZE, PLAYERVISUALSIZE); // position, then size
    //frog.image = frogSpriteImage;
    //frogSpriteImage.resize(PLAYERRADIUS, PLAYERRADIUS);
    frog.rotationLock = true
    //callingtiles
    tileCreate();
    intvTimer = setInterval(timerFunc, 1000);
}

/**********************************************************/
// tilecreate
// Called by jttsSetup
// Create tiles
// Input:  n/a
// Return: n/a
/**********************************************************/
function tileCreate() {
    console.log("tilescreated: ");
    //grass code
    grass = new Group();
    grass.spriteSheet = tileSheetImage;
    grass.collider = "static";
    grass.addAni({ w: 32, h: 32, row: 1, col: 2 });
    grass.tile = "g";
    
    //finishBlock code
    finishBlock = new Group();
    finishBlock.spriteSheet = tileSheetImage;
    finishBlock.collider = "static";
    finishBlock.addAni({ w: 32, h: 32, row: 6, col: 0 });
    finishBlock.tile = "f";

    //lavaBlock code
    lavaBlock = new Group();
    lavaBlock.spriteSheet = tileSheetImage;
    lavaBlock.collider = "static";
    lavaBlock.addAni({ w: 32, h: 32, row: 1, col: 4 });
    lavaBlock.tile = "l";



    //tiles
    new Tiles(
        [
            ".....................................ffff...............................",
            "........................................................................",
            "............................gggg........................................",
            "........................................................................",
            "..........................................gggg..........................",
            "....................gggg................................................",
            "..................................................gggg..................",
            "............................gggg........................................",
            "........................................................................",
            "............................................gggg........................",
            "........................................................................",
            "......................gggg..............................................",
            "........................................................................",
            "........................................gggg............................",
            "........................................................................",
            ".............................gggg.......................................",
            "........................................................................",
            "..................................gggg..................................",
            "llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll"
        ],
             -390,
             -150, //x, y
        32,
        32 //w, h
    );
        
}

/**********************************************************/
// loadEndScreen
// Called by Draw
// Load End Screen
// Input:  Frog touches finish block and wins game
// Return: n/a
/**********************************************************/
function loadEndScreen() {
    console.log("Loaded End Screen")
    window.location.href = "jttsendscreen.html";
}

/**********************************************************/
// timerFunc
// Called by jttsSetup
// Create timer
// Input:  n/a
// Return: n/a
/**********************************************************/
function timerFunc() {
    console.log("Timer running")
    sec++;
   // p_timer.textContent = 'time: ' + sec;
}

/**********************************************************/
// frogDies
// Called by draw
// When frog dies, respawns it at start position
// Input:  Frog touches lava
// Return: n/a
/**********************************************************/
function frogDies() {
    frog.x = windowWidth / 2;
    frog.y = windowHeight / 2;
}


function draw() {
   console.log("Draw: "+millis())
   clear();
   
   //camera
  // camera.x = frog.x;
   //camera.y = frog.y;
   camera.zoom = 1.5;
  
  //frog jumping code
   if (kb.presses("ArrowUp")) {
       if (frog.velocity.y === 0) {
       frog.velocity.y = 30;
       }
   }
   if (kb.pressing("ArrowLeft")) {
           frog.velocity.x = -2
   } else if (kb.pressing("ArrowRight")) {
           frog.velocity.x = 2
   } 
   
   //when frog falls and hits lava code
   if (frog.collides(lavaBlock)) {
    frogDies();
   };
   
   //end screen code
   //frog.collides(finishBlock, loadEndScreen);
   
}