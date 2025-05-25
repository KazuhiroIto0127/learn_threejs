import * as THREE from 'three';

function createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // より魅力的なマテリアル（ライティングに反応する）
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff88,
        shininess: 100,
        specular: 0x222222
    });
    
    const cube = new THREE.Mesh(geometry, material);
    return cube;
}

export { createCube };