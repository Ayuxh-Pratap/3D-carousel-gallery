"use client";

import HeaderHUD from "./HeaderHUD";
import FooterHUD from "./FooterHUD";

interface GridOverlayProps {
    activeSlide: number;
    totalSlides: number;
}

export default function GridOverlay({ activeSlide, totalSlides }: GridOverlayProps) {
    const progress = totalSlides > 1 ? (activeSlide / (totalSlides - 1)) * 100 : 0;

    return (
        <div className="absolute inset-0 z-10 grid grid-cols-[40px_1fr_40px] grid-rows-[40px_1fr_40px] md:grid-cols-[60px_1fr_60px] md:grid-rows-[60px_1fr_60px] pointer-events-none">
            {/* Grid lines */}
            <div className="gl-line w-full h-px left-0 top-[40px] md:top-[60px]" />
            <div className="gl-line w-full h-px left-0 bottom-[40px] md:bottom-[60px]" />
            <div className="gl-line h-full w-px top-0 left-[40px] md:left-[60px]" />
            <div className="gl-line h-full w-px top-0 right-[40px] md:right-[60px]" />

            {/* Corner crosshairs */}
            <div className="crosshair absolute w-2.5 h-2.5 top-[35px] left-[35px] md:top-[55px] md:left-[55px]" />
            <div className="crosshair absolute w-2.5 h-2.5 top-[35px] right-[35px] md:top-[55px] md:right-[55px]" />
            <div className="crosshair absolute w-2.5 h-2.5 bottom-[35px] left-[35px] md:bottom-[55px] md:left-[55px]" />
            <div className="crosshair absolute w-2.5 h-2.5 bottom-[35px] right-[35px] md:bottom-[55px] md:right-[55px]" />

            {/* Header */}
            <HeaderHUD />

            {/* Left side text */}
            <div className="col-start-1 row-start-2 flex justify-center items-center side-text rotate-180 meta-text">
                <span className="text-[#555555]">LOVE_LETTER [FOR_YOU]</span>
            </div>

            {/* Right side text */}
            <div className="col-start-3 row-start-2 flex justify-center items-center side-text meta-text">
                <span>HEARTBEAT_SYNC</span>
            </div>

            {/* Footer */}
            <FooterHUD activeSlide={activeSlide} totalSlides={totalSlides} />

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
                <div
                    className="h-full bg-white transition-[width] duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
