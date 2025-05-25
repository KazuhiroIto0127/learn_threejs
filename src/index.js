import * as THREE from 'three';
import { createCube } from './cube';

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

// ライティングの追加
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// キューブの作成と追加
const cube = createCube();
scene.add(cube);

camera.position.z = 5;

// マウス操作用の変数
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// マウスイベントリスナー
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
    mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
    
    targetRotationX = mouseY * Math.PI;
    targetRotationY = mouseX * Math.PI;
});

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    // スムーズな回転
    cube.rotation.x += (targetRotationX - cube.rotation.x) * 0.05;
    cube.rotation.y += (targetRotationY - cube.rotation.y) * 0.05;
    
    // 自動回転も少し追加
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}

animate();