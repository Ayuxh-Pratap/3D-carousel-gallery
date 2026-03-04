"use client";

import { useEffect, useState } from "react";

export default function HeaderHUD() {
    const [time, setTime] = useState("00:00:00 [GMT]");

    useEffect(() => {
        const update = () => {
            const now = new Date().toISOString().split("T")[1].split(".")[0];
            setTime(`${now} [GMT]`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="col-start-2 row-start-1 flex justify-between items-center px-5 meta-text">
            <div className="flex items-center">
                <span className="font-bold mr-4">CORE_SYSTEM</span>
                <span className="text-[#555555]">NODE.V2.X</span>
            </div>
            <div>KINETIC / SYNERGY / FLOW</div>
            <div className="text-[#555555]">{time}</div>
        </header>
    );
}
