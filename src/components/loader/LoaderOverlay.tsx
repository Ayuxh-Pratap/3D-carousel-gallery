"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoaderOverlay() {
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loaderRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        if (loaderRef.current) {
                            loaderRef.current.style.display = "none";
                        }
                    },
                });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 text-[11px] tracking-[0.3em] text-[#EAEAEA]"
        >
            SYSTEM_CALIBRATION...
        </div>
    );
}
