import * as THREE from "three";
import { initializeUser, getBestTime, saveBestTime } from "./user.js";

const loggedIn = await initializeUser();

if (!loggedIn) {
    window.location.href = "login.html";
}

const startScreen = document.getElementById("startScreen");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");

const finalTimeElement = document.getElementById("finalTime");

const bestTimeElementStart = document.getElementById("bestTimeStart");
const bestTimeElementEnd = document.getElementById("bestTimeEnd");

async function updateBestTime()
{
    const bestTime = await getBestTime();

    console.log("Fetched best time:", bestTime);
    console.log("Start element:", bestTimeElementStart);
    console.log("End element:", bestTimeElementEnd);

    if (bestTimeElementStart) {
        bestTimeElementStart.textContent = bestTime;
    }

    if (bestTimeElementEnd) {
        bestTimeElementEnd.textContent = bestTime;
    }
}

await updateBestTime();

let gameState = "menu";

let boatHealth = 20;

const maxHealth = 100;

let survivalTime = 0;

let obstacleSpawnTimer = 0;

let nextObstacleSpawn = THREE.MathUtils.randFloat(1.5, 3.5);

let obstacles = [];

const timerElement = document.getElementById("timer");

function updateGameUI()
{
    startScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    if (gameState === "menu")
    {
        startScreen.classList.remove("hidden");
    }

    if (gameState === "paused")
    {
        pauseScreen.classList.remove("hidden");
    }

    if (gameState === "gameOver")
    {
        gameOverScreen.classList.remove("hidden");
    }
}

startButton.addEventListener("click", function()
{
    gameState = "playing";

    previousTime = undefined;

    survivalTime = 0;

    obstacleSpawnTimer = 0;

    nextObstacleSpawn = THREE.MathUtils.randFloat(1.5, 3.5);

    boatHealth = maxHealth;

    updateHealthBar();
    
    timerElement.textContent = 0;

    updateGameUI();
});

restartButton.addEventListener("click", function()
{
    gameState = "playing";

    previousTime = undefined;

    survivalTime = 0;

    obstacleSpawnTimer = 0;

    nextObstacleSpawn = THREE.MathUtils.randFloat(1.5, 3.5);

    boatHealth = maxHealth;

    updateHealthBar();
    
    timerElement.textContent = 0;

    updateGameUI();
});

pauseButton.addEventListener("click", function()
{

    if (gameState !== "playing") return;

    gameState = "paused";

    previousTime = undefined;

    updateGameUI();
});

resumeButton.addEventListener("click", function()
{
    if (gameState !== "paused") return;

    gameState = "playing";

    previousTime = undefined;

    updateGameUI();
});

async function endGame()
{
    if (gameState !== "playing") return;

    gameState = "gameOver";

    previousTime = undefined;

    finalTimeElement.textContent = Math.floor(survivalTime);

    for (let obstacle of obstacles) {
        scene.remove(obstacle);
    }

    obstacles = [];

    updateGameUI();

    await saveBestTime(survivalTime);

    await updateBestTime();
}

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.set(0,15,10);

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias : true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);

const world = new THREE.Group();

const riverGeometry = new THREE.PlaneGeometry(30, 100);

const riverMaterial = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.3
});

const river = new THREE.Mesh(riverGeometry, riverMaterial);

river.rotation.x = -Math.PI / 2;

//scene.add(river);

const bankGeometry = new THREE.BoxGeometry(30, 1, 100);

const bankMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22
});

const leftBank = new THREE.Mesh(bankGeometry, bankMaterial);

leftBank.position.set(-30, -0.5, 0);

//scene.add(leftBank);

const rightBank = new THREE.Mesh(bankGeometry, bankMaterial);

rightBank.position.set(30, -0.5, 0);

//scene.add(rightBank);

world.add(river);
world.add(leftBank);
world.add(rightBank);

scene.add(world);

world.userData.positionX = world.position.x;
world.userData.rotationZ = world.rotation.z;
world.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);

const boat = new THREE.Group();

const boatGeometry = new THREE.BoxGeometry(1.8, 0.6, 3.4);

const boatMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513
});

const boatBody = new THREE.Mesh(
    boatGeometry,
    boatMaterial
);

boatBody.position.y = 0.35;

boat.add(boatBody);

const boatBox = new THREE.Box3();

boat.userData.startY = boat.position.y;
boat.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);

//boat.add(camera);

scene.add(boat);

function createObstacle()
{
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 5);

    const material = new THREE.MeshStandardMaterial({
        color: 0x654321
    });

    const obstacle = new THREE.Mesh(geometry, material);

    obstacle.position.x = THREE.MathUtils.randFloat(-11, 11);
    obstacle.position.y = 0.1;
    obstacle.position.z = -19;

    obstacle.rotation.z = THREE.MathUtils.randFloat(1.5, 2.5);
    obstacle.rotation.y = THREE.MathUtils.randFloat(0, 2);

    obstacle.userData.startRotation = obstacle.rotation.z;
    obstacle.userData.startY = obstacle.position.y;
    obstacle.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);
    obstacle.userData.boundingBox = new THREE.Box3();

    scene.add(obstacle);

    obstacles.push(obstacle);
}

function updateObstacleSpawning(deltaTime)
{
    obstacleSpawnTimer += deltaTime;

    if (obstacleSpawnTimer >= nextObstacleSpawn)
    {
        createObstacle();

        obstacleSpawnTimer = 0;

        nextObstacleSpawn = THREE.MathUtils.randFloat(1.5, 3.5);
    }
}

function updateObstacles(deltaTime)
{
    for (let i = obstacles.length - 1; i >= 0; i--)
    {
        const obstacle = obstacles[i];

        obstacle.position.z += 5 * deltaTime;

        obstacle.userData.phase += 2 * deltaTime;

        obstacle.position.y = obstacle.userData.startY + Math.sin(obstacle.userData.phase) * 0.3;

        obstacle.rotation.z = obstacle.userData.startRotation + Math.sin(obstacle.userData.phase) * 0.2;

        if (obstacle.position.z > boat.position.z + 20)
        {
            scene.remove(obstacle);

            obstacles.splice(i, 1);
        }
    }
}

function checkCollisions()
{
    boatBox.setFromObject(boat);

    for (let obstacle of obstacles)
    {
        obstacle.userData.boundingBox.setFromObject(obstacle);

        if (boatBox.intersectsBox(obstacle.userData.boundingBox))
        {
            boatHealth -= 20;

            boatHealth = Math.max(0, boatHealth);

            updateHealthBar();

            console.log("Boat hit!");
            console.log("Health:", boatHealth);

            scene.remove(obstacle);

            obstacles.splice(obstacles.indexOf(obstacle), 1);

            if (boatHealth <= 0) {
                endGame();
            }

            break;
        }
    }
}

const healthFill = document.getElementById("healthFill");

function updateHealthBar()
{
    const healthPercentage = (boatHealth / maxHealth) * 100;

    healthFill.style.width = healthPercentage + "%";
}

const mouse = new THREE.Vector2();

const raycaster = new THREE.Raycaster();

const keys = {};

window.addEventListener(
    "keydown",
    function(event)
    {
        keys[event.key.toLowerCase()] = true;
    }
);

window.addEventListener(
    "keyup",
    function(event)
    {
        keys[event.key.toLowerCase()] = false;
    }
);

function moveBoat(deltaTime)
{
    const speed = 8;

    const direction = new THREE.Vector3(0, 0, 0);

    if (keys["w"])
    {
        direction.z -= 1;
    }

    if (keys["s"])
    {
        direction.z += 1;
    }

    if (keys["a"])
    {
        direction.x -= 1;
    }

    if (keys["d"])
    {
        direction.x += 1;
    }

    direction.normalize();

    boat.position.addScaledVector(direction, speed * deltaTime);

    boat.position.x = THREE.MathUtils.clamp(boat.position.x, -11, 11);

    boat.position.z = THREE.MathUtils.clamp(boat.position.z, -17, 8);

    boat.userData.phase += 4 * deltaTime;

    boat.position.y = boat.userData.startY + Math.sin(boat.userData.phase) * 0.2;
}

function moveWorld(deltaTime) {
    world.userData.phase += 2 * deltaTime;

    world.position.x = world.userData.positionX + Math.sin(world.userData.phase) * 0.1;

    world.rotation.z = world.userData.rotationZ + Math.sin(world.userData.phase) * 0.05;
}

renderer.domElement.addEventListener("click", function(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    let mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

})

let previousTime;

function animate(currentTime)
{
    requestAnimationFrame(animate);

    if (previousTime === undefined)
    {
        previousTime = currentTime;
    }

    const deltaTime = (currentTime - previousTime) / 1000;

    previousTime = currentTime;

    if (gameState === "playing")
    {
        moveWorld(deltaTime);

        moveBoat(deltaTime);

        updateObstacleSpawning(deltaTime);

        updateObstacles(deltaTime);

        checkCollisions();

        survivalTime += deltaTime;

        timerElement.textContent = Math.floor(survivalTime);
    }

    renderer.render(scene, camera);
}

animate(performance.now());