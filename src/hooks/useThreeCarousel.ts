"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { CAROUSEL_CONFIG, CAROUSEL_CONTENT, SCENE_CONFIG } from "@/lib/constants";
import {
    createCarousel,
    updateCarousel,
    disposeCarousel,
    type CarouselMesh,
} from "@/components/canvas/CarouselScene";

interface UseThreeCarouselOptions {
    onActiveSlideChange?: (index: number) => void;
    onHoverChange?: (hovering: boolean) => void;
}

export function useThreeCarousel(
    containerRef: React.RefObject<HTMLDivElement | null>,
    options?: UseThreeCarouselOptions
) {
    const rafId = useRef<number>(0);
    const scrollRef = useRef(0);
    const scrollTargetRef = useRef(0);
    const mouseRef = useRef(new THREE.Vector2());
    const meshesRef = useRef<CarouselMesh[]>([]);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const touchStartYRef = useRef(0);

    const onActiveSlideChange = useRef(options?.onActiveSlideChange);
    const onHoverChange = useRef(options?.onHoverChange);
    onActiveSlideChange.current = options?.onActiveSlideChange;
    onHoverChange.current = options?.onHoverChange;

    const handleWheel = useCallback((e: WheelEvent) => {
        scrollTargetRef.current += e.deltaY * 0.002 * CAROUSEL_CONFIG.speed;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, []);

    const handleResize = useCallback(() => {
        const renderer = rendererRef.current;
        const camera = cameraRef.current;
        if (!renderer || !camera) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }, []);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            touchStartYRef.current = e.touches[0].clientY;
        }
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartYRef.current - currentY;
            touchStartYRef.current = currentY;
            scrollTargetRef.current += deltaY * 0.01 * CAROUSEL_CONFIG.speed;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── Scene ────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(SCENE_CONFIG.fogColor, SCENE_CONFIG.fogDensity);
        sceneRef.current = scene;

        // ── Camera ───────────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(
            SCENE_CONFIG.fov,
            window.innerWidth / window.innerHeight,
            SCENE_CONFIG.near,
            SCENE_CONFIG.far
        );
        camera.position.z = SCENE_CONFIG.cameraZ;
        cameraRef.current = camera;

        // ── Renderer ─────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ── Carousel ─────────────────────────────────────────────────
        const { group, meshes } = createCarousel(scene);
        groupRef.current = group;
        meshesRef.current = meshes;

        // ── Listeners ────────────────────────────────────────────────
        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        // ── Animation loop ───────────────────────────────────────────
        let lastActiveIdx = -1;

        const animate = () => {
            const time = performance.now() * 0.001;

            // Inertia / damping
            scrollRef.current +=
                (scrollTargetRef.current - scrollRef.current) * CAROUSEL_CONFIG.damping;

            // Update carousel positions & get active slide
            const activeIdx = updateCarousel(
                meshes,
                scrollRef.current,
                time,
                scrollTargetRef.current
            );

            if (activeIdx !== lastActiveIdx) {
                lastActiveIdx = activeIdx;
                onActiveSlideChange.current?.(activeIdx);
            }

            // Raycaster hover
            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const hits = raycasterRef.current.intersectObjects(meshes);

            meshes.forEach((m) => {
                gsap.to(m.material.uniforms.uHover, { value: 0, duration: 0.6 });
            });

            if (hits.length > 0) {
                const hitMesh = hits[0].object as CarouselMesh;
                gsap.to(hitMesh.material.uniforms.uHover, {
                    value: 1,
                    duration: 0.4,
                });
                onHoverChange.current?.(true);
            } else {
                onHoverChange.current?.(false);
            }

            renderer.render(scene, camera);
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        // ── Cleanup ──────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(rafId.current);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);

            disposeCarousel(meshes, group, scene);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        totalSlides: CAROUSEL_CONTENT.length,
    };
}
