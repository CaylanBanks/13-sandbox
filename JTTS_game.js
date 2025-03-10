//program by Caylan Banks
//Jump to the Sky game, vertical platformer game where you have 
//to parkour to reach the top


console.log("%c JTTS_game.js", "color: blue;");
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

function setup() {
    console.log("setup: ");
    console.log(
        "Canvas Created, dimensions: (w/h)" + canvas.w + "/" + canvas.h
    );
    //gravity
    world.gravity.y = 8;
    
    //timer
     p_timer.textContent = 'time: ' + sec;
    
    //frog creation
    cnv = new Canvas(windowWidth, (windowHeight - 176));
    frog = new Sprite(windowWidth / 2, windowHeight / 2, PLAYERVISUALSIZE, PLAYERVISUALSIZE); // position, then size
    frog.addImage(frogSpriteImage);
    frogSpriteImage.resize(PLAYERRADIUS, PLAYERRADIUS);
    frog.rotationLock = true
    //callingtiles
    tileCreate();
    intvTimer = setInterval(timerFunc, 1000);
}


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

function loadEndScreen() {
    console.log("Loaded End Screen")
    window.location.href = "jttsendscreen.html";
}

function timerFunc() {
    console.log("Timer running")
    sec++;
    p_timer.textContent = 'time: ' + sec;
}

function frogDies() {
    frog.x = windowWidth / 2;
    frog.y = windowHeight / 2;
}



function draw() {
   console.log("Draw: ")
   clear();
   
   //camera
   camera.on()
   camera.x = frog.x
   camera.y = frog.y
   camera.zoom = 1.5;
   camera.off()
  
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
   } else {
       frog.velocity.x = 0;
   }
   
   //when frog falls and hits lava code
   frog.collides(lavaBlock, frogDies);
   
   //end screen code
   frog.collides(finishBlock, loadEndScreen);
   
}