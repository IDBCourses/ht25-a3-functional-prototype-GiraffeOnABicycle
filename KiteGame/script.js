import * as Util from "../util.js";

// --- Create elements ---
const sky = Util.createThing("Sky");
const ground = Util.createThing("Ground");
const kite = Util.createThing("Kite");

// --- Physics variables ---

//Kites current position
let kiteX = window.innerWidth / 2;
let kiteY = window.innerHeight / 2;

// Horizontal and vertical speed
let velX = 0;
let velY = 0;

//puls kite downward
const gravity = 0.2;

//Lift when pressing "up" key
const lift = 0.35;

//Additional downforce whn pressing down
const downForce = 0.35;

//Base strength of winds horizontal force
const windBase = 0.20;

// --- Game state ---
let gameOver = false;

// --- Wind system ---

//random fluctuation of wind strength
let gust = 0;
// Random fluctuation of wind direction
let windDir = 0;

// --- Yank system ---

//Position of yank point
const yankPointX = window.innerWidth / 2;
const yankPointY = window.innerHeight * 0.75;
//Maximum yank force and maximum hold time
const maxYankStrength = 80;
const maxHoldTime = 3000; // ms
let yankStartTime = null;

// Keeping track of which keys are currently being held down
const keysDown = {};

// Tracks when game started
let gameStartTime = 0;

// --- Setup the scene ---
function createSky() {
    const skyHeight = (window.innerHeight * 2) / 3;
    Util.setSize(window.innerWidth, skyHeight, sky);
    Util.setColour(200, 60, 60, 1, sky);
    sky.style.borderRadius = "0";
    sky.style.top = "0px";
    sky.style.left = "0px";
    sky.style.position = "absolute";
}

function createGround() {
    const groundHeight = window.innerHeight / 3;
    Util.setSize(window.innerWidth, groundHeight, ground);
    Util.setColour(100, 40, 40, 1, ground);
    ground.style.position = "absolute";
    ground.style.top = (window.innerHeight * 2) / 3 + "px";
    ground.style.left = "0px";
    ground.style.borderRadius = "0";
}

function createKite() {
    const size = 100;
    Util.setSize(size, size, kite);
    Util.setColour(30, 50, 60, 1, kite);
    Util.setPositionPixels(kiteX, kiteY, kite);
    kite.style.borderRadius = "0";
    kite.style.position = "absolute";
}

// --- Reset game ---
function resetGame() {
    kiteX = window.innerWidth / 2;
    kiteY = window.innerHeight * 0.25;
    velX = 0;
    velY = -1;
    windDir = 0;
    gust = 0;
    yankStartTime = null;
    gameStartTime = Date.now();
    gameOver = false; // ✅ Reset flag so loop runs again
    Util.setPositionPixels(kiteX, kiteY, kite);
}

// --- Yank mechanic ---
function yankKite(strength) {
    const dx = yankPointX - kiteX;
    const dy = yankPointY - kiteY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / distance;
    const dirY = dy / distance;
    velX += dirX * strength;
    velY += dirY * strength;
}

// --- Input listeners ---

//checks if a key is pressed
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    keysDown[key] = true;
// Starts timing the "yank"
    if (key === " " && yankStartTime === null) {
        yankStartTime = Date.now();
    }
    
});
//When spacebar is released, calculate how long it was held down

document.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();
    keysDown[key] = false;

//Calculates how long space bar was held down and convert into yank strength
    if (key === " " && yankStartTime !== null) {
        const heldDuration = Date.now() - yankStartTime;
        const yankPower = Math.min(heldDuration / maxHoldTime, 1) * maxYankStrength;
       //Call the yank strength
        yankKite(yankPower);
        //reset yank timer
        yankStartTime = null;
    }
});

// --- Main game loop ---

//Stops updating if game is over
function loop() {
    if (gameOver) return;

    // Wind physics

    const time = Date.now() / 1000;
    //Slowly changes wind
    const baseWind = Math.sin(time * 0.3);
    //Adds random gusts of wind
    gust += (Math.random() - 0.5) * 0.05;
    gust = Math.max(-1, Math.min(1, gust));
    windDir = baseWind + gust;
    velX += windDir * windBase;
    velY += gravity;

//Strength of arrow keys
    if (keysDown["arrowup"] || keysDown["w"]) velY -= lift;
    if (keysDown["arrowdown"] || keysDown["s"]) velY += downForce;
    if (keysDown["arrowleft"] || keysDown["a"]) velX -= 0.2;
    if (keysDown["arrowright"] || keysDown["d"]) velX += 0.2;

// Moves the kite based on current velocity
    kiteX += velX;
    kiteY += velY;

//Adds drag to kite
    velX *= 0.98;
    velY *= 0.98;

//Clamping to stop kite from moving too fast
    velY = Math.max(-8, Math.min(8, velY));
    velX = Math.max(-5, Math.min(5, velX));

    //Collision detection
    const kiteSize = 100;
    const groundY = (window.innerHeight * 2) / 3;

    if (kiteY <= 0) {
        kiteY = 0;
        Util.setPositionPixels(kiteX, kiteY, kite);
        endGame;
        return;
    }

    if (kiteX <= 0) {
        kiteX = 0;
        Util.setPositionPixels(kiteX, kiteY, kite);
        endGame;
        return;
    }

    if (kiteX + kiteSize >= window.innerWidth) {
        kiteX = window.innerWidth - kiteSize;
        Util.setPositionPixels(kiteX, kiteY, kite);
        endGame;
        return;
    }

    if (kiteY + kiteSize >= groundY) {
        kiteY = groundY - kiteSize;
        Util.setPositionPixels(kiteX, kiteY, kite);
        endGame;
        return;
    }

    // --- Continue motion ---
    Util.setPositionPixels(kiteX, kiteY, kite);
    Util.setRotation(velX * 2, kite);

    requestAnimationFrame(loop);
}

// --- Initialize ---
function setup() {
    createSky();
    createGround();
    createKite();
    resetGame();
    loop();
}

setup();
