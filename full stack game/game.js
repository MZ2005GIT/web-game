import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { currentUser, currentProfile } from "./user.js";

if (!currentProfile || !currentUser) {
    console.log("Error fetching profile");
    window.location.href = "login.html"
}

let currentLevel = currentProfile.wave;
const maxLevels = 100;
let currentEnemies = 1;
let currentEnemySpeed = 1;
let currentShootingSpeed = 0.8; //secs
let currentBullets = 10
const enemyHealth = 5;

if (currentLevel <= 25) {
    currentEnemies = currentLevel * 2;
} else if (currentLevel > 25 && currentLevel <= 50) {
    currentEnemies = 25 + Math.round(currentLevel * 1.7);
    currentEnemySpeed = 1.5;
} else if (currentLevel > 50 && currentLevel <= 100) {
    currentEnemies = 50 + Math.round(currentLevel * 1.4);
    currentEnemySpeed = 2;
}

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.set(0,15,15);

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias : true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls  = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.003;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);

const groundGeometry = new THREE.BoxGeometry(100, 2, 100, 100, 1, 100);

const groundMaterial = new THREE.MeshStandardMaterial({color: 0x228b22});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.position.y = 1;

scene.add(ground);

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

function setColor() {

    if (keys["a"]) {
        blockColor.set(0xffffff);
    }

    if (keys["b"]) {
        blockColor.set(0x0000ff);
    }
    
    if (keys["c"]) {
        blockColor.set(0xffff00);
    }

    if (keys["d"]) {
        blockColor.set(0x00ff00);
    }
}

const blocks = [];

renderer.domElement.addEventListener("click", function(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    let mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

    const blockIntersections = raycaster.intersectObjects(blocks, false);

    const groundIntersections = raycaster.intersectObject(ground, false);

    if (blockIntersections.length === 0 && groundIntersections.length === 0)
    {
        return null;
    }

    if (blockIntersections.length > 0)
    {
        const point = blockIntersections[0].point;

        const gridPosition = snapToGrid(point, blockIntersections[0].point.y);

        createBlock(gridPosition);

        return;
    }

    const point = groundIntersections[0].point;

    const gridPosition = snapToGrid(point, 2);

    createBlock(gridPosition);
})

function snapToGrid(point, height)
{
    // const x = Math.round(point.x + 0.5) - 0.5;
    // const z = Math.round(point.z + 0.5) - 0.5;

    const x = Math.floor(point.x) + 0.5;
    const z = Math.floor(point.z) + 0.5;
    const y = Math.floor(height) + 0.5;

    return new THREE.Vector3(x, y, z);
}

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

    controls.update();

    renderer.render(scene, camera);
}

animate(performance.now());