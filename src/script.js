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
camera.position.set(12, 25, 20);
scene.add(camera);

/**
 * lights
 */
const light = new THREE.PointLight(0xffffff, 3, 0, 0);
camera.add(light);

/**
 * controlls - orbital controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 20;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;
/**
 * texture
 */
const loader = new THREE.TextureLoader();
const texture = loader.load(disc);
texture.colorSpace = THREE.SRGBColorSpace;

/**
 * dodecahedron
 */

let dodecahedronGeometry = new THREE.DodecahedronGeometry(10);
dodecahedronGeometry.deleteAttribute("normal");
dodecahedronGeometry.deleteAttribute("uv");
dodecahedronGeometry = BufferGeometryUtils.mergeVertices(dodecahedronGeometry);

const positions = dodecahedronGeometry.getAttribute("position");
const vertices = [];
for (let i = 0; i < positions.count; i++) {
  const vertex = new THREE.Vector3();
  vertex.fromBufferAttribute(positions, i);
  vertices.push(vertex);
}

/**
 * points material and stuff
 */
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x0080ff,
  map: texture,
  size: 1,
  alphaTest: 0.5,
});

const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

/**
 * adding the convex hull
 */
const convexGeometry = new ConvexGeometry(vertices);
const convexMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  opacity: 0.25,
  side: THREE.DoubleSide,
  transparent: true,
});
const mesh = new THREE.Mesh(convexGeometry, convexMaterial);
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
  mesh.rotation.y += 0.005;
  points.rotation.y += 0.005;

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
