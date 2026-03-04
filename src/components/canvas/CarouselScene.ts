import * as THREE from "three";
import { CAROUSEL_CONFIG, CAROUSEL_CONTENT } from "@/lib/constants";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

export interface CarouselMesh extends THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> {
    userData: { index: number; originalX: number };
}

// ── Build carousel meshes ───────────────────────────────────────────
export function createCarousel(scene: THREE.Scene) {
    const group = new THREE.Group();
    scene.add(group);

    const texLoader = new THREE.TextureLoader();
    const meshes: CarouselMesh[] = [];

    CAROUSEL_CONTENT.forEach((item, i) => {
        const texture = texLoader.load(item.img, (tex) => {
            const img = tex.image as { width?: number; height?: number } | undefined;
            if (img?.width && img?.height) {
                material.uniforms.uTextureAspect.value = img.width / img.height;
            } else {
                material.uniforms.uTextureAspect.value = 1;
            }
        });

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uTime: { value: 0 },
                uSpeed: { value: 0 },
                uOffset: { value: i * CAROUSEL_CONFIG.gap },
                uHover: { value: 0 },
                uPlaneAspect: { value: CAROUSEL_CONFIG.cardW / CAROUSEL_CONFIG.cardH },
                uTextureAspect: { value: 1 },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
            side: THREE.DoubleSide,
        });

        const geometry = new THREE.PlaneGeometry(
            CAROUSEL_CONFIG.cardW,
            CAROUSEL_CONFIG.cardH,
            CAROUSEL_CONFIG.segments,
            CAROUSEL_CONFIG.segments
        );

        const mesh = new THREE.Mesh(geometry, material) as CarouselMesh;
        mesh.position.x = i * CAROUSEL_CONFIG.gap;
        mesh.userData = { index: i, originalX: i * CAROUSEL_CONFIG.gap };

        group.add(mesh);
        meshes.push(mesh);
    });

    return { group, meshes };
}

// ── Per-frame update with infinite wrap-around ──────────────────────
export function updateCarousel(
    meshes: CarouselMesh[],
    scroll: number,
    time: number,
    scrollTarget: number
) {
    const totalW = CAROUSEL_CONTENT.length * CAROUSEL_CONFIG.gap;
    let activeIdx = 0;
    let minDist = Infinity;

    meshes.forEach((m) => {
        let x = m.userData.originalX - scroll;

        // Infinite wrap-around
        while (x < -totalW / 2) x += totalW;
        while (x > totalW / 2) x -= totalW;

        m.position.x = x;

        const d = Math.abs(x);
        // Softer vertical/depth motion to keep cards closer to axis
        m.position.y = Math.sin(x * 0.8 + time) * 0.18;
        m.position.z = Math.cos(x * 0.8 + time) * 0.25 - Math.pow(d * 0.35, 2);
        m.rotation.y = -x * 0.08;

        // Update uniforms
        m.material.uniforms.uTime.value = time;
        m.material.uniforms.uSpeed.value = scrollTarget - scroll;
        m.material.uniforms.uOffset.value = x;

        if (d < minDist) {
            minDist = d;
            activeIdx = m.userData.index;
        }
    });

    return activeIdx;
}

// ── Dispose all geometries and materials ────────────────────────────
export function disposeCarousel(meshes: CarouselMesh[], group: THREE.Group, scene: THREE.Scene) {
    meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
        const tex = m.material.uniforms.uTexture.value as THREE.Texture;
        tex?.dispose();
    });
    scene.remove(group);
}
