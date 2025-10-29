import * as Util from "../util.js";

// --- Create elements ---
const sky = Util.createThing("Sky");
const ground = Util.createThing("Ground");
const kite = Util.createThing("Kite");

// --- Physics variables ---
let kiteX = window.innerWidth / 2;
let kiteY = window.innerHeight / 2;
let velX = 0;
let velY = 0;

const gravity = 0.2;
const lift = 0.35;
const downForce = 0.35;
const windBase = 0.12; // how strong wind affects motion

// --- Wind system ---
let gust = 0;
let windDir = 0;

//Timer message
let gameStartTime = 0;

// --- Input tracking ---
const keysDown = {};

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
    kite.style.transformOrigin = "center";
}

// --- Reset game ---
function resetGame() {
    kiteX = window.innerWidth / 2;
    kiteY = window.innerHeight * 0.25; // start high in the sky
    velX = 0;
    velY = -1; // small upward push
    windDir = 0;
    gust = 0;
    gameStartTime = Date.now(); // record new start time
    Util.setPositionPixels(kiteX, kiteY, kite);
}


// --- Event listeners ---
document.addEventListener("keydown", e => {
    keysDown[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keysDown[e.key.toLowerCase()] = false;
});

// --- Main game loop ---
function loop() {
    // --- Wind update ---
    const time = Date.now() / 1000;
    const baseWind = Math.sin(time * 0.3);  // smooth oscillation
    gust += (Math.random() - 0.5) * 0.05;   // add turbulence
    gust = Math.max(-1, Math.min(1, gust));
    windDir = baseWind + gust;              // combine
    velX += windDir * windBase;             // apply to kite

    // --- Gravity and controls ---
    velY += gravity;

    if (keysDown["arrowup"] || keysDown["w"]) velY -= lift;
    if (keysDown["arrowdown"] || keysDown["s"]) velY += downForce;
    if (keysDown["arrowleft"] || keysDown["a"]) velX -= 0.2;
    if (keysDown["arrowright"] || keysDown["d"]) velX += 0.2;

    // --- Apply motion ---
    kiteX += velX;
    kiteY += velY;

    // --- Apply drag (air resistance) ---
    velX *= 0.98;
    velY *= 0.98;

    // --- Limit speed ---
    velY = Math.max(-8, Math.min(8, velY));
    velX = Math.max(-5, Math.min(5, velX));

    // --- Collision checks ---
  // --- Collision checks ---
const kiteSize = 100;
const groundY = (window.innerHeight * 2) / 3;
const elapsed = ((Date.now() - gameStartTime) / 1000).toFixed(1); // seconds, 1 decimal place

if (kiteY + kiteSize > groundY) {
    alert(`💥 The kite hit the ground!\nYou lasted ${elapsed} seconds.`);
    resetGame();
}
else if (kiteY < 0) {
    alert(`🎈 Oh no! Your kite flew away!\nYou lasted ${elapsed} seconds.`);
    resetGame();
}
else if (kiteX < 0 || kiteX + kiteSize > window.innerWidth) {
    alert(`🎈 Oh no! Your kite flew away!\nYou lasted ${elapsed} seconds.`);
    resetGame();
}


    // Clamp within visible area
    kiteX = Math.max(0, Math.min(window.innerWidth - kiteSize, kiteX));
    kiteY = Math.max(0, Math.min(groundY - kiteSize, kiteY));

    // --- Update visual position and rotation ---
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