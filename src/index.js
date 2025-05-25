import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

// ライティングの追加
const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 追加の指向性ライト（反対側から）
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-5, 3, -5);
scene.add(directionalLight2);

// GLBモデルを格納する変数
let model = null;

// GLTFローダーでGLBファイルを読み込み
const loader = new GLTFLoader();
loader.load(
    './obake.glb',
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        
        // モデルのサイズを調整（必要に応じて）
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        
        console.log('GLBモデルが正常に読み込まれました');
    },
    (progress) => {
        console.log('読み込み進行状況:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('GLBファイルの読み込みエラー:', error);
    }
);

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
    
    // モデルが読み込まれている場合のみ回転を適用
    if (model) {
        // スムーズな回転
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
        
        // 自動回転も少し追加
        model.rotation.x += 0.005;
        model.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

animate();