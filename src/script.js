import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import disc from "../static/disc.png";

let camera, scene, renderer;
const canvas = document.querySelector("canvas.webgl");

/**
 * setting the basic scene
 */
scene = new THREE.Scene();

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// setting up the renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * camera
 */
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 3, 3);
scene.add(camera);

/**
 * controlls - orbital controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * texture
 */
const loader = new THREE.TextureLoader();
const texture = loader.load(disc);

/**
 * dodecahedron
 */

const dodecahedronGeometry = new THREE.DodecahedronGeometry(2, 1);
const dodecahedronMaterial = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: true,
});
const mesh = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
scene.add(mesh);
camera.lookAt(mesh.position);

/**
 * resize window
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update the camera
  camera.aspect = sizes.width / sizes.height;

  // update projection matrix
  camera.updateProjectionMatrix();

  // update the renderer after resizing the page
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * animation
 */
const animate = () => {
  // mesh.rotation.y += 0.025;

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
