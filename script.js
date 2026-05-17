// 1. Setup Webcam Background
const video = document.getElementById("webcam");
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => { video.srcObject = stream; })
  .catch(err => { 
    console.error("Camera access denied", err); 
    alert("Please allow camera access to view the AR menu.");
  });

// 2. Tap to Place Logic
const scene = document.querySelector('a-scene');
const pizza = document.getElementById('pizza');
const camera = document.getElementById('camera');
const instructionText = document.getElementById('instruction-text');

// Ensure A-Frame is loaded
if (scene.hasLoaded) {
  addClickListener();
} else {
  scene.addEventListener('loaded', addClickListener);
}

function addClickListener() {
  document.body.addEventListener('click', (e) => {
    // Ignore clicks on the bottom UI card
    if(e.target.closest('.dish-info')) return;
    
    // Get camera's current 3D position and rotation
    const cameraPosition = camera.getAttribute('position');
    const camera3D = camera.object3D;
    
    // Get the direction the camera is currently looking
    const direction = new THREE.Vector3();
    camera3D.getWorldDirection(direction);
    
    // Calculate a new position 1.5 meters directly in front of the camera
    const distance = -1.5; // Negative because A-Frame camera looks down the negative Z axis
    const newPos = {
      x: cameraPosition.x + (direction.x * distance),
      y: cameraPosition.y + (direction.y * distance) - 0.5, // Move it down slightly so it looks like it's on a table
      z: cameraPosition.z + (direction.z * distance)
    };

    // Move the pizza to that exact spot and make it visible
    pizza.setAttribute('position', newPos);
    pizza.setAttribute('visible', 'true');
    
    // Update instruction text
    instructionText.innerText = "Pizza placed! Move your phone to look around.";
    instructionText.style.backgroundColor = "rgba(0, 200, 0, 0.6)";
  });
}