import * as THREE from "three";
import { initializeUser, currentUser, currentProfile } from "./user.js";

const loggedIn = await initializeUser();

if (!loggedIn) {
    window.location.href = "login.html";
}

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.set(0,16,16);

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias : true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);

const riverGeometry = new THREE.PlaneGeometry(20, 100);

const riverMaterial = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.3
});

const river = new THREE.Mesh(riverGeometry, riverMaterial);

river.rotation.x = -Math.PI / 2;

scene.add(river);

const bankGeometry = new THREE.BoxGeometry(15, 1, 100);

const bankMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22
});

const leftBank = new THREE.Mesh(bankGeometry, bankMaterial);

leftBank.position.set(-17.5, -0.5, 0);

scene.add(leftBank);

const rightBank = new THREE.Mesh(bankGeometry, bankMaterial);

rightBank.position.set(17.5, -0.5, 0);

scene.add(rightBank);

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

scene.add(boat);

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

    renderer.render(scene, camera);
}

animate(performance.now());