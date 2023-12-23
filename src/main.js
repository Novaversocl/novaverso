import * as THREE from 'three';
import { createApp } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import App from './App.vue';

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

// Cubo con textura de madera
var geometry = new THREE.BoxGeometry(30, 30, 30);

// Cargar la textura desde una URL
var textureLoader = new THREE.TextureLoader();
var texture1 = textureLoader.load('public/textura/oro2.jpg');
var texture2 = textureLoader.load('public/textura/oro2.jpg');
var texture3 = textureLoader.load('public/textura/oro2.jpg');

var materials = [
  new THREE.MeshBasicMaterial({ map: texture1 }), // Textura en la cara frontal
  new THREE.MeshBasicMaterial({ map: texture2 }), // Textura en la cara posterior
  new THREE.MeshBasicMaterial({ map: texture3 }), // Textura en la cara superior
  new THREE.MeshBasicMaterial({ map: texture1 }), // Textura en la cara inferior
  new THREE.MeshBasicMaterial({ map: texture2 }), // Textura en la cara derecha
  new THREE.MeshBasicMaterial({ map: texture3 })  // Textura en la cara izquierda
];

var cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Texto principal (amarillo)
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  // Texto principal (amarillo)
  const textGeometry = new TextGeometry('Novaverso', {
    font: font,
    size: 20,
    height: 0,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelSegments: 0
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-65, 35, -100);
  scene.add(textMesh);

  // Texto de borde (blanco)
  // const textGeometryBorder = new TextGeometry('Novaverso', {
  //   font: font,
  //   size: 20,
  //   height: -10,
  //   curveSegments: 10,
  //   bevelEnabled: true,
  //   bevelThickness: 1,  // Ajusta el grosor del borde
  //   bevelSize: 1,       // Ajusta el tamaño del borde
  //   bevelSegments: 1
  // });

  const textMaterialBorder = new THREE.MeshBasicMaterial({ color: 0xffffff });  // Color blanco para el borde
  const textMeshBorder = new THREE.Mesh(textGeometryBorder, textMaterialBorder);
  textMeshBorder.position.set(-65, 35, -100);
  scene.add(textMeshBorder);
});

// Partículas (Estrellas)
var particlesGeometry = new THREE.BufferGeometry();
var particlesMaterial = new THREE.PointsMaterial({
  size: 1,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  vertexColors: true  // Habilitar colores por vértice
});

var particlesVertices = [];
var particlesColors = [];

for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());

  particlesVertices.push(x, y, z);
  particlesColors.push(color.r, color.g, color.b);
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particlesColors, 3));

var particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Partícula móvil en zigzag de color rojo
var mobileParticleGeometry = new THREE.BufferGeometry();
var mobileParticleMaterial = new THREE.PointsMaterial({
  size: 2,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  color: new THREE.Color(0xff0000) // Rojo
});

var mobileParticleVertices = [];
var direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
direction.normalize();
var speed = 1;

for (let i = 0; i < 1; i++) {
  mobileParticleVertices.push(0, 0,0);
}

mobileParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mobileParticleVertices, 3));
var mobileParticle = new THREE.Points(mobileParticleGeometry, mobileParticleMaterial);
scene.add(mobileParticle);

// Cámara
var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
camera.position.z = 400;
camera.position.y = 160;
camera.lookAt(cube.position);
scene.add(camera);

// Luces
var light1 = new THREE.PointLight(0xff0044);
light1.position.set(120, 260, 100);

var light2 = new THREE.PointLight(0x4499ff);
light2.position.set(-100, 100, 200);

scene.add(light1);
scene.add(light2);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

renderer.setClearColor(0x000000);

// Agregar el control de órbita
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.35;

// Controlar el tamaño de la ventana
window.addEventListener('resize', () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
});

// Renderizar
function render() {
  requestAnimationFrame(render);

  // Actualizar posición de la partícula móvil en zigzag
  for (let i = 0; i < mobileParticleVertices.length; i += 3) {
    mobileParticleVertices[i] += direction.x * speed;
    mobileParticleVertices[i + 1] += direction.y * speed;
    mobileParticleVertices[i + 2] += direction.z * speed;

    // Cambiar la dirección cuando alcanza ciertos límites
    if (mobileParticleVertices[i] > 100 || mobileParticleVertices[i] < -100) {
      direction.x *= -1;
    }
    if (mobileParticleVertices[i + 1] > 100 || mobileParticleVertices[i + 1] < -100) {
      direction.y *= -1;
    }
    if (mobileParticleVertices[i + 2] > 100 || mobileParticleVertices[i + 2] < -100) {
      direction.z *= -1;
    }
  }

  mobileParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mobileParticleVertices, 3));
  mobileParticleGeometry.attributes.position.needsUpdate = true;

  controls.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Renderizar
render();

createApp(App).mount('#app');
