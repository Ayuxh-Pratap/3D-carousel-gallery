// ── Carousel configuration ──────────────────────────────────────────
export const CAROUSEL_CONFIG = {
  speed: 1.8,
  damping: 0.08,
  cardW: 3.8,
  cardH: 2.2,
  gap: 4.8,
  segments: 64,
} as const;

// ── Scene configuration ─────────────────────────────────────────────
export const SCENE_CONFIG = {
  fogColor: 0x050505,
  fogDensity: 0.12,
  fov: 45,
  near: 0.1,
  far: 100,
  cameraZ: 6,
  maxPixelRatio: 2,
} as const;

// ── Carousel content ────────────────────────────────────────────────
export interface CarouselItem {
  img: string;
  title: string;
}

export const CAROUSEL_CONTENT: CarouselItem[] = [
  {
    img: "/personal/p1.png",
    title: "OUR_FIRST_CHAPTER",
  },
  {
    img: "/personal/p2.png",
    title: "MOMENTS_WITH_YOU",
  },
  {
    img: "/personal/p3.png",
    title: "YOU_ARE_MY_HOME",
  },
  {
    img: "/personal/p4.png",
    title: "FOREVER_US_TWO",
  },
  {
    img: "/personal/p5.png",
    title: "MY_FAVORITE_MEMORY",
  },
];
