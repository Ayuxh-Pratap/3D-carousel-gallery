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
    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop",
    title: "QUANTUM_SHIFT",
  },
  {
    img: "https://images.unsplash.com/photo-1635776062127-d379bfcbb9c8?q=80&w=2000&auto=format&fit=crop",
    title: "PLASMA_ARC",
  },
  {
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
    title: "CYBER_SPHERE",
  },
  {
    img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2000&auto=format&fit=crop",
    title: "DARK_MATTER",
  },
  {
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop",
    title: "LIGHT_SYNC",
  },
];
