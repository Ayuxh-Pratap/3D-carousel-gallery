"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CustomCursorProps {
    isHovering: boolean;
}

export default function CustomCursor({ isHovering }: CustomCursorProps) {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (ringRef.current) {
                gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.15 });
            }
            if (dotRef.current) {
                gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: 0.05 });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (!ringRef.current) return;
        if (isHovering) {
            gsap.to(ringRef.current, { width: 64, height: 64, duration: 0.3 });
        } else {
            gsap.to(ringRef.current, { width: 40, height: 40, duration: 0.3 });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-10 h-10 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
            />
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
            />
        </>
    );
}
