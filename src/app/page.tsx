"use client";

import { useState, useCallback } from "react";
import ThreeCanvas from "@/components/canvas/ThreeCanvas";
import CustomCursor from "@/components/cursor/CustomCursor";
import LoaderOverlay from "@/components/loader/LoaderOverlay";
import GridOverlay from "@/components/hud/GridOverlay";
import { CAROUSEL_CONTENT } from "@/lib/constants";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleActiveSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const handleHoverChange = useCallback((hovering: boolean) => {
    setIsHovering(hovering);
  }, []);

  return (
    <div
      id="spatial-root"
      className="relative w-full h-screen overflow-hidden bg-black text-[#EAEAEA]"
      style={{ fontFamily: "'SF Mono', monospace", cursor: "none" }}
    >
      {/* Loader */}
      <LoaderOverlay />

      {/* Custom cursor */}
      <CustomCursor isHovering={isHovering} />

      {/* HUD grid overlay */}
      <GridOverlay activeSlide={activeSlide} totalSlides={CAROUSEL_CONTENT.length} />

      {/* Three.js canvas */}
      <ThreeCanvas
        onActiveSlideChange={handleActiveSlideChange}
        onHoverChange={handleHoverChange}
      />
    </div>
  );
}
