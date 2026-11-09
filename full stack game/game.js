import * as THREE from "three";
import { initializeUser, currentUser, currentProfile } from "./user.js";

const loggedIn = await initializeUser();

if (!loggedIn) {
    window.location.href = "login.html";
}

let boatHealth = 100;

const maxHealth = 100;

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

const riverGeometry = new THREE.PlaneGeometry(20, 100);

const riverMaterial = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.3
});

const river = new THREE.Mesh(riverGeometry, riverMaterial);

river.rotation.x = -Math.PI / 2;

//scene.add(river);

const bankGeometry = new THREE.BoxGeometry(20, 1, 100);

const bankMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22
});

const leftBank = new THREE.Mesh(bankGeometry, bankMaterial);

leftBank.position.set(-20, -0.5, 0);

//scene.add(leftBank);

const rightBank = new THREE.Mesh(bankGeometry, bankMaterial);

rightBank.position.set(20, -0.5, 0);

//scene.add(rightBank);

world.add(river);
world.add(leftBank);
world.add(rightBank);

scene.add(world);

world.userData.positionX = world.position.x;
world.userData.rotationZ = world.rotation.z;
world.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);

const boat = new THREE.Group();

const boatGeometry = new THREE.BoxGeometry(1.8, 0.5, 3.4);

const boatMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513
});

const boatBody = new THREE.Mesh(
    boatGeometry,
    boatMaterial
);

boatBody.position.y = 0.35;

boat.add(boatBody);

boat.userData.startY = boat.position.y;
boat.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);

//boat.add(camera);

scene.add(boat);

const obstacles = [];

function createObstacle()
{
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 5);

    const material = new THREE.MeshStandardMaterial({
        color: 0x654321
    });

    const obstacle = new THREE.Mesh(geometry, material);

    obstacle.position.x = THREE.MathUtils.randFloat(-8, 8);
    obstacle.position.y = 0.1;
    obstacle.position.z = -19;

    obstacle.rotation.z = THREE.MathUtils.randFloat(1.5, 2.5);
    obstacle.rotation.y = THREE.MathUtils.randFloat(0, 2);

    obstacle.userData.startRotation = obstacle.rotation.z;
    obstacle.userData.startY = obstacle.position.y;
    obstacle.userData.phase = THREE.MathUtils.randFloat(0, Math.PI * 2);

    scene.add(obstacle);

    obstacles.push(obstacle);
}

createObstacle();


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

    boat.position.x = THREE.MathUtils.clamp(boat.position.x, -9, 9);

    boat.position.z = THREE.MathUtils.clamp(boat.position.z, -17, 8);

    boat.userData.phase += 2 * deltaTime;

    boat.position.y = boat.userData.startY + Math.sin(boat.userData.phase) * 0.4;
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

    moveWorld(deltaTime);

    moveBoat(deltaTime);

    updateObstacles(deltaTime);

    renderer.render(scene, camera);
}

animate(performance.now());