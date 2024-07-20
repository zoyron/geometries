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
scene.background = new THREE.Color(0xaaccff);

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
const light = new THREE.PointLight(0xffffff, 4, 0, 0);
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

let dodecahedronGeometry = new THREE.IcosahedronGeometry(14, 1);
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
  color: 0xff8000,
  map: texture,
  size: 0.5,
  alphaTest: 1,
});

// const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
const pointsGeometry = new THREE.BufferGeometry().setAttribute(
  "position",
  new THREE.BufferAttribute(positions.array, 3)
);
const points = new THREE.Points(pointsGeometry, pointsMaterial);

scene.add(points);

/**
 * adding the convex hull
 */
const convexGeometry = new ConvexGeometry(vertices);
const convexMaterial = new THREE.MeshLambertMaterial({
  color: 0x0080ff,
  opacity: 0.75,
  // side: THREE.DoubleSide,
  transparent: true,
});
const mesh = new THREE.Mesh(convexGeometry, convexMaterial);
scene.add(mesh);
// scene.add(new THREE.AxesHelper(24));
camera.lookAt(mesh.position);

/**
 * bounding sphere of the Convex hull
 */
// convexGeometry.computeBoundingSphere();
// const boundingSphere = convexGeometry.boundingSphere;
// const boundingSphereGeometry = new THREE.SphereGeometry(
//   boundingSphere.radius,
//   16,
//   16
// );
// const boundingSphereMaterial = new THREE.PointsMaterial({
//   color: 0xff8000,
//   size: 0.1,
// });

// const boundingSphereMesh = new THREE.Points(
//   boundingSphereGeometry,
//   boundingSphereMaterial
// );
// scene.add(boundingSphereMesh);

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
  // boundingSphereMesh.rotation.y += 0.005;
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
