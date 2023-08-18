import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import textureStars from "./img/stars.jpg";
import textureSun from "./img/sun.jpg";
import textureEarth from "./img/earth.jpg";
import textureJupiter from "./img/jupiter.jpg";
import textureMars from "./img/mars.jpg";
import textureMercury from "./img/mercury.jpg";
import textureNeptune from "./img/neptune.jpg";
import textureSaturn from "./img/saturn.jpg";
import textureSaturnring from "./img/saturn_ring.png";
import textureTitan from "./img/titan.jpg";
import textureUranus from "./img/Uranus.jpg";
import textureUranusring from "./img/uranus_ring.png";
import textureVenus from "./img/venus.jpg";
import textureMoon from "./img/moon.jpg";
// import spaceShip from "./assets/spaceShip.glb";

const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true; // enable shadows manually
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Choose the shadow map type you prefer
// renderer.shadowMap.autoUpdate = false; // To manually control shadow updates
// renderer.shadowMap.needsUpdate = true; // update shadows

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
// scene.add(hemisphereLight);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

camera.position.set(-90, 140, 140);
orbit.update();

// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

//skybox
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  textureStars,
  textureStars,
  textureStars,
  textureStars,
  textureStars,
  textureStars,
]);
const textureLoader = new THREE.TextureLoader();

// objects in the solar system
// 1. Center of the system - Sun
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureSun),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Pointlight on sun
// const sunLight = new THREE.PointLight(0xffffff, 1, 100); // white light
// sunLight.position.set(20, 20, 20); // position the light away from the scene
// sunLight.castShadow = true; // enable shadow casting
// sunLight.shadow.mapSize.width = 512; // set the shadow map resolution
// sunLight.shadow.mapSize.height = 512;
// sunLight.shadow.camera.near = 0.5; // set the shadow camera near and far planes
// sunLight.shadow.camera.far = 100;
// scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100, 10000);
pointLight.position.set(0, 100, 0);
scene.add(pointLight);

// sun directional light
const sunDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
sunDirectionalLight.position.set(-10, 0, 0);
scene.add(sunDirectionalLight);

function createPlanets(size, texture, position, ring, moon) {
  const Geometry = new THREE.SphereGeometry(size, 30, 30);
  const Material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planetMesh = new THREE.Mesh(Geometry, Material);
  const planetObj = new THREE.Object3D();
  planetObj.add(planetMesh);
  if (ring) {
    const ringGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    planetObj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(planetObj);
  planetMesh.position.x = position;
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  return { planetMesh, planetObj }; // returning these as they're needed in the rotation.
}

const mercury = createPlanets(3.2, textureMercury, 28);
const venus = createPlanets(5.8, textureVenus, 44);
const earth = createPlanets(6, textureEarth, 62, null, {
  texture: textureMoon,
});

const earthMoonSize = earth.planetMesh.geometry.parameters.radius * 0.25; // moon size relative to the planet
const earthMoonGeometry = new THREE.SphereGeometry(earthMoonSize, 30, 30);
const earthMoonMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureMoon),
});
const earthMoonMesh = new THREE.Mesh(earthMoonGeometry, earthMoonMaterial);
const earthMoonObj = new THREE.Object3D();
earthMoonObj.add(earthMoonMesh);
earthMoonMesh.position.x = earth.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
earth.planetMesh.add(earthMoonObj);

const mars = createPlanets(4, textureMars, 78);
const jupiter = createPlanets(12, textureJupiter, 100);

//Saturn
const saturn = createPlanets(10, textureSaturn, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: textureSaturnring,
});

// Saturn.Titan
const titanSize = saturn.planetMesh.geometry.parameters.radius * 0.05; // moon size relative to the planet
const titanGeometry = new THREE.SphereGeometry(titanSize, 30, 30);
const titanMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureTitan),
});
const titanMesh = new THREE.Mesh(titanGeometry, titanMaterial);
const titanObj = new THREE.Object3D();
titanObj.add(titanMesh);
titanObj.position.set(saturn.planetMesh.geometry.parameters.radius * 1.5, 2, 0);
// titanMesh.position.x = saturn.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
saturn.planetMesh.add(titanObj);

// Saturn.Pandora
const pandoraSize = saturn.planetMesh.geometry.parameters.radius * 0.05; // moon size relative to the planet
const pandoraGeometry = new THREE.SphereGeometry(pandoraSize, 30, 30);
const pandoraMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureTitan),
});

const pandoraMesh = new THREE.Mesh(pandoraGeometry, pandoraMaterial);
const pandoraObj = new THREE.Object3D();
pandoraObj.add(pandoraMesh);
pandoraObj.position.set(
  saturn.planetMesh.geometry.parameters.radius * 1.5,
  5,
  0
);
pandoraMesh.position.x = saturn.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
saturn.planetMesh.add(pandoraObj);

// Saturn.Atlas
const atlasSize = saturn.planetMesh.geometry.parameters.radius * 0.03; // moon size relative to the planet
const atlasGeometry = new THREE.SphereGeometry(atlasSize, 30, 30);
const atlasMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureTitan),
});

const atlasMesh = new THREE.Mesh(atlasGeometry, atlasMaterial);
const atlasObj = new THREE.Object3D();
atlasObj.add(atlasMesh);
atlasObj.position.set(saturn.planetMesh.geometry.parameters.radius * 1.5, 0, 0);
atlasMesh.position.x = saturn.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
saturn.planetMesh.add(atlasObj);

// Saturn.Prometheus
const prometheusSize = saturn.planetMesh.geometry.parameters.radius * 0.03; // moon size relative to the planet
const prometheusGeometry = new THREE.SphereGeometry(prometheusSize, 30, 30);
const prometheusMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureTitan),
});

const prometheusMesh = new THREE.Mesh(prometheusGeometry, prometheusMaterial);
const prometheusObj = new THREE.Object3D();
prometheusObj.add(prometheusMesh);
prometheusObj.position.set(
  saturn.planetMesh.geometry.parameters.radius * 0.5,
  -0.5,
  0
);
prometheusMesh.position.x = saturn.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
saturn.planetMesh.add(prometheusObj);

// Saturn.Helene
const heleneSize = saturn.planetMesh.geometry.parameters.radius * 0.03; // moon size relative to the planet
const heleneGeometry = new THREE.SphereGeometry(heleneSize, 30, 30);
const heleneMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(textureTitan),
});

const heleneMesh = new THREE.Mesh(heleneGeometry, heleneMaterial);
const heleneObj = new THREE.Object3D();
heleneObj.add(heleneMesh);
heleneObj.position.set(
  saturn.planetMesh.geometry.parameters.radius * 0.5,
  -2,
  0
);
heleneMesh.position.x = saturn.planetMesh.geometry.parameters.radius * 1.5; // adjusting the moon's distance from the planet
saturn.planetMesh.add(heleneObj);

const uranus = createPlanets(7, textureUranus, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: textureUranusring,
});
const neptune = createPlanets(7, textureNeptune, 200);

// const pointLight = new THREE.PointLight(0xffffff, 5, 1000);
// scene.add(pointLight);

// Space ship
// const gltfLoader = new GLTFLoader();
// gltfLoader.load(spaceShip);
// scene.add(gltfLoader);

function animate() {
  // rotate sun
  requestAnimationFrame(animate);
  sun.rotateY(0.004);

  mercury.planetMesh.rotateY(0.004);
  mercury.planetObj.rotateY(0.04);

  venus.planetMesh.rotateY(0.002);
  venus.planetObj.rotateY(0.015);

  earth.planetMesh.rotateY(0.02);
  earth.planetObj.rotateY(0.01);

  mars.planetMesh.rotateY(0.018);
  mars.planetObj.rotateY(0.008);

  jupiter.planetMesh.rotateY(0.04);
  jupiter.planetObj.rotateY(0.002);

  saturn.planetMesh.rotateY(0.038);
  saturn.planetObj.rotateY(0.0009);

  uranus.planetMesh.rotateY(0.03);
  uranus.planetObj.rotateY(0.0004);

  neptune.planetMesh.rotateY(0.032);
  neptune.planetObj.rotateY(0.0001);

  if (earthMoonObj) {
    earthMoonMesh.rotateY(0.03);
    earthMoonObj.rotateY(0.025);
  }

  if (titanObj) {
    titanMesh.rotateY(0.025);
    titanObj.rotateY(0.0015);
  }

  if (pandoraObj) {
    pandoraMesh.rotateY(0.001);
    pandoraObj.rotateY(0.004);
  }

  if (atlasObj) {
    atlasMesh.rotateY(0.003);
    atlasObj.rotateY(0.025);
  }

  if (prometheusObj) {
    prometheusMesh.rotateY(0.0001);
    prometheusObj.rotateY(0.0003);
  }

  if (heleneObj) {
    heleneMesh.rotateY(0.00005);
    heleneObj.rotateY(0.000025);
  }

  //   console.log(orbit);

  //   orbit.target = saturn.position;

  orbit.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
