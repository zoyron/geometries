import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * debug - gui pannel
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(2, 2, 2);
// geometry.computeBoundingBox();
const material = new THREE.MeshBasicMaterial({
  color: "#87CEEB",
});
const mesh = new THREE.Mesh(geometry, material);
// const boxHelper = new THREE.BoxHelper(mesh, 0xff0000);
scene.add(mesh);
// scene.add(boxHelper);
// Compute the bounding sphere
geometry.computeBoundingSphere();

// Get the computed bounding sphere
const boundingSphere = geometry.boundingSphere;

// Create a sphere geometry for visualization
const sphereGeometry = new THREE.SphereGeometry(boundingSphere.radius, 64, 64);
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: "#FFFACD",
  wireframe: true,
});
const boundingSphereMesh = new THREE.Mesh(sphereGeometry, wireframeMaterial);

// Position the wireframe sphere at the center of the bounding sphere
boundingSphereMesh.position.copy(boundingSphere.center);

// Add the bounding sphere mesh to the scene
scene.add(boundingSphereMesh);
/**
 * gui controls
 * with lil-gui, you can only modify the properties of the object
 * for example, in the object mesh.position, the properties are x,y and x
 * you can modify them since they are properties.
 * You can modify other properties as well
 */
gui.add(mesh.position, "y", -2, 2, 0.01);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y += 0.005;
  boundingSphereMesh.rotation.y -= 0.0025;

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
