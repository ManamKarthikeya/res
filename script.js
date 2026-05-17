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
    // Ignore clicks on the UI
    if(e.target.closest('.dish-info') || e.target.closest('.top-bar')) return;
    
    // Convert the 2D screen tap into WebGL normalized coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Cast a 3D ray directly through the exact pixel the user tapped
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera.components.camera.camera);

    const direction = raycaster.ray.direction;
    const cameraPosition = camera.getAttribute('position');
    
    // Move the model 2 meters exactly down that ray (prevents clipping the camera)
    const distance = 2.0; 
    
    const newPos = {
      x: cameraPosition.x + (direction.x * distance),
      y: cameraPosition.y + (direction.y * distance),
      z: cameraPosition.z + (direction.z * distance)
    };

    // Move the 3D model to that exact spot and make it visible
    pizza.setAttribute('position', newPos);
    pizza.setAttribute('visible', 'true');
    
    // Make sure the model faces the user so it doesn't look sideways
    const cameraRotation = camera.getAttribute('rotation');
    pizza.setAttribute('rotation', `0 ${cameraRotation.y} 0`);
    
    // Update instruction text
    instructionText.innerText = "Placed exactly where you tapped!";
    instructionText.style.backgroundColor = "rgba(0, 200, 0, 0.6)";
  });
}