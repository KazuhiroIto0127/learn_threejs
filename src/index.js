import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.6), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// レンダラーのサイズを上半分に設定
const threeContainer = document.getElementById('three-container');
renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
renderer.setClearColor(0x222222);
threeContainer.appendChild(renderer.domElement);

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

// 初期カメラアニメーション用の変数
let isInitialAnimation = true;
let animationStartTime = Date.now();
const animationDuration = 4000; // 4秒で1周
const cameraRadius = 5;

camera.position.z = cameraRadius;

// OrbitControlsの設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // スムーズな動きのためのダンピング
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // カメラの最小距離
controls.maxDistance = 10; // カメラの最大距離
controls.maxPolarAngle = Math.PI / 2; // 上下の回転制限
controls.enableZoom = false; // マウスホイールでのズームを無効化してページスクロールを可能にする

// 初期アニメーション中はコントロールを無効化
controls.enabled = false;

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.6);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
});

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    // 初期カメラアニメーション
    if (isInitialAnimation) {
        const elapsed = Date.now() - animationStartTime;
        const progress = elapsed / animationDuration;

        if (progress < 1) {
            // カメラを円周上で回転させる
            const angle = progress * Math.PI * 2; // 1周 (2π)
            camera.position.x = cameraRadius * Math.sin(angle);
            camera.position.z = cameraRadius * Math.cos(angle);
            camera.position.y = 0;

            // 常に中央を向く
            camera.lookAt(0, 0, 0);
        } else {
            // アニメーション完了、OrbitControlsを有効化
            isInitialAnimation = false;
            controls.enabled = true;
        }
    } else {
        // OrbitControlsの更新
        controls.update();
    }

    renderer.render(scene, camera);
}

animate();
