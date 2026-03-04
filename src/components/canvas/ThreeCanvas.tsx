"use client";

import { useRef } from "react";
import { useThreeCarousel } from "@/hooks/useThreeCarousel";

interface ThreeCanvasProps {
    onActiveSlideChange?: (index: number) => void;
    onHoverChange?: (hovering: boolean) => void;
}

export default function ThreeCanvas({ onActiveSlideChange, onHoverChange }: ThreeCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useThreeCarousel(containerRef, {
        onActiveSlideChange,
        onHoverChange,
    });

    return <div ref={containerRef} className="fixed inset-0 z-0" />;
}
