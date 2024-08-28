import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import dat from "dat.gui";

// debug
const gui = new dat.GUI();

const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};

// texture loader
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/flag.jpg");

/**
 * Sizes
 */
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

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("#262837");

document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// plane
const plane = new THREE.PlaneGeometry(3, 3, 512, 512);

const planeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },
    uSurfaceColor: { value: new THREE.Color(debugObject.depthColor) },
    uDepthColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorMultiplier: { value: 3 },
    uColorOffset: { value: 0.5 },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
  },
  side: THREE.DoubleSide,
  fog: true,
});

// debug
gui
  .add(planeMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Wave elevation");
gui
  .add(planeMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Wave frequency x");
gui
  .add(planeMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Wave frequency y");
gui
  .add(planeMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("Wave speed");
gui
  .addColor(debugObject, "depthColor")
  .name("Depth color")
  .onChange(() => {
    planeMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });
gui
  .addColor(debugObject, "surfaceColor")
  .name("Surface color")
  .onChange(() => {
    planeMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });
gui
  .add(planeMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Color multiplier");
gui
  .add(planeMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1.5)
  .step(0.001)
  .name("Color offset");
gui
  .add(planeMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("SWaveElevation");
gui
  .add(planeMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("sWavefrequency");
gui
  .add(planeMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("SWaveSpeed");
gui
  .add(planeMaterial.uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(5)
  .step(1)
  .name("Small wave iterations");
const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.rotation.x = -Math.PI * 0.5;

scene.add(planeMesh);

// tick
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update uniforms
  planeMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
