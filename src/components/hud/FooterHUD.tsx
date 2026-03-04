interface FooterHUDProps {
    activeSlide: number;
    totalSlides: number;
}

export default function FooterHUD({ activeSlide, totalSlides }: FooterHUDProps) {
    const current = String(activeSlide + 1).padStart(2, "0");
    const total = String(totalSlides).padStart(2, "0");
    const progress = totalSlides > 1 ? (activeSlide / (totalSlides - 1)) * 100 : 0;

    return (
        <footer className="col-start-2 row-start-3 flex justify-between items-center px-5 meta-text">
            <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full mr-3 shadow-[0_0_12px_#00FF41]" />
                <span>RESONANCE STABLE</span>
            </div>
            <div className="text-[#555555]">
                {current} / {total}
            </div>
            <div className="w-[100px]" />
        </footer>
    );
}
