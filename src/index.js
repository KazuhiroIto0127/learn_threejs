import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.6), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

// レンダラーの高品質設定
const threeContainer = document.getElementById('three-container');
renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0a0a);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
threeContainer.appendChild(renderer.domElement);

// ポストプロセッシングの設定
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// ブルーム効果
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight * 0.6),
    0.3, // strength
    0.4, // radius
    0.85 // threshold
);
composer.addPass(bloomPass);

// アンチエイリアシング
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight * 0.6);
composer.addPass(smaaPass);

// 最終出力
const outputPass = new OutputPass();
composer.addPass(outputPass);

// 環境マッピング用のHDR環境テクスチャを作成（プロシージャル）
const createEnvironmentTexture = () => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    // グラデーション環境を作成
    const envScene = new THREE.Scene();
    const envGeometry = new THREE.SphereGeometry(50, 32, 32);
    const envMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x0077ff) },
            bottomColor: { value: new THREE.Color(0x000033) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide
    });

    const envMesh = new THREE.Mesh(envGeometry, envMaterial);
    envScene.add(envMesh);

    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;
    scene.background = envTexture;

    pmremGenerator.dispose();
    envScene.remove(envMesh);
    envGeometry.dispose();
    envMaterial.dispose();
};

createEnvironmentTexture();

// 高品質ライティングの設定
const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
scene.add(ambientLight);

// メインライト（影付き）
const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
mainLight.position.set(10, 10, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -10;
mainLight.shadow.camera.right = 10;
mainLight.shadow.camera.top = 10;
mainLight.shadow.camera.bottom = -10;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);

// フィルライト
const fillLight = new THREE.DirectionalLight(0x8888ff, 0.8);
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// リムライト
const rimLight = new THREE.DirectionalLight(0xffaa88, 1.2);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

// パーティクル効果の追加
const createParticles = () => {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = Math.random() * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        colors[i * 3] = 0.5 + Math.random() * 0.5;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    return particleSystem;
};

const particles = createParticles();

// GLBモデルを格納する変数
let model = null;

// GLTFローダーでGLBファイルを読み込み
const loader = new GLTFLoader();
loader.load(
    './obake.glb',
    (gltf) => {
        model = gltf.scene;

        // モデルの材質を高品質に設定
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    // 材質の品質向上
                    child.material.envMapIntensity = 0.8;
                    child.material.needsUpdate = true;

                    // 半透明効果（おばけらしく）
                    if (child.material.name && child.material.name.includes('body')) {
                        child.material.transparent = true;
                        child.material.opacity = 0.9;
                        child.material.transmission = 0.1;
                    }
                }
            }
        });

        scene.add(model);
        model.scale.set(1, 1, 1);
        model.position.set(0, -1, 0);

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
const animationDuration = 4000;
const cameraRadius = 6;

camera.position.set(0, 2, cameraRadius);

// OrbitControlsの設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 3;
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI / 1.8;
controls.enableZoom = false;
controls.target.set(0, 0, 0);

// 初期アニメーション中はコントロールを無効化
controls.enabled = false;

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.6;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);

    // ブルーム効果のサイズも更新
    bloomPass.setSize(width, height);
    smaaPass.setSize(width, height);
});

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // 初期カメラアニメーション
    if (isInitialAnimation) {
        const elapsed = Date.now() - animationStartTime;
        const progress = elapsed / animationDuration;

        if (progress < 1) {
            const angle = progress * Math.PI * 2;
            camera.position.x = cameraRadius * Math.sin(angle);
            camera.position.z = cameraRadius * Math.cos(angle);
            camera.position.y = 2 + Math.sin(progress * Math.PI * 4) * 0.5;
            camera.lookAt(0, 0, 0);
        } else {
            isInitialAnimation = false;
            controls.enabled = true;
        }
    } else {
        controls.update();
    }

    // モデルの微細なアニメーション
    if (model) {
        model.rotation.y += 0.005;
        model.position.y = -1 + Math.sin(time * 2) * 0.1;
    }

    // パーティクルのアニメーション
    if (particles) {
        particles.rotation.y += 0.001;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + positions[i]) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // ライトの微細なアニメーション
    mainLight.intensity = 2.0 + Math.sin(time * 3) * 0.2;
    rimLight.intensity = 1.2 + Math.sin(time * 2) * 0.3;

    // ポストプロセッシングでレンダリング
    composer.render();
}

animate();
