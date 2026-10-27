import React, { useEffect, useRef, useState } from 'react';
import { Eye, Flame, Camera } from 'lucide-react';

export default function ThermalHeatmap({ coldSpotActive = false, entityType = "" }) {
    const canvasRef = useRef(null);
    const [palette, setPalette] = useState('ironbow'); // 'ironbow' or 'nightvision'
    const [contrast, setContrast] = useState(80);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frameId;
        let t = 0;

        const render = () => {
            t += 0.04;
            const w = canvas.width;
            const h = canvas.height;

            // Draw thermal gradient background
            const imgData = ctx.createImageData(w, h);
            const data = imgData.data;

            // Simulated room ambient thermal noise
            for (let y = 0; y < h; y += 4) {
                for (let x = 0; x < w; x += 4) {
                    // Distance from ghost center
                    const ghostX = w / 2 + Math.sin(t * 0.8) * (w * 0.25);
                    const ghostY = h / 2 + Math.cos(t * 0.6) * (h * 0.2);
                    const distToGhost = Math.hypot(x - ghostX, y - ghostY);

                    // Base ambient temperature (around 20C)
                    let temp = 20.0 + Math.sin(x * 0.05 + t) * 2 + Math.cos(y * 0.05) * 2;

                    if (coldSpotActive) {
                        // Cold spot anomaly creates a deep negative temperature pit
                        if (distToGhost < 45) {
                            temp -= (1 - distToGhost / 45) * 16; // Drops to ~4C
                        }
                    }

                    // Map temperature to color
                    let r = 0, g = 0, b = 0;
                    if (palette === 'ironbow') {
                        // Ironbow thermal palette: Purple -> Blue -> Red -> Yellow -> White
                        if (temp < 10) {
                            // Freezing spectral cold spot
                            r = 10; g = 40; b = 180 + Math.floor((10 - temp) * 8);
                        } else if (temp < 18) {
                            r = 40; g = 120; b = 140;
                        } else if (temp < 23) {
                            r = 180; g = 80; b = 40;
                        } else {
                            r = 250; g = 220; b = 80;
                        }
                    } else {
                        // Night Vision Green
                        const val = Math.min(255, Math.max(20, Math.floor((temp / 25) * 200)));
                        r = 10; g = val; b = 25;
                    }

                    // Fill 4x4 block for retro FLIR resolution
                    for (let dy = 0; dy < 4; dy++) {
                        for (let dx = 0; dx < 4; dx++) {
                            const idx = ((y + dy) * w + (x + dx)) * 4;
                            data[idx] = r;
                            data[idx + 1] = g;
                            data[idx + 2] = b;
                            data[idx + 3] = 255;
                        }
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);

            // Draw thermal crosshairs & HUD overlays
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(w / 2 - 15, h / 2);
            ctx.lineTo(w / 2 + 15, h / 2);
            ctx.moveTo(w / 2, h / 2 - 15);
            ctx.lineTo(w / 2, h / 2 + 15);
            ctx.stroke();

            // Thermal HUD text
            ctx.font = '10px ui-monospace, monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`FLIR THERMAL: ${coldSpotActive ? 'COLD ANOMALY' : 'STABLE'}`, 10, 18);
            ctx.fillText(`SPOT: ${coldSpotActive ? '04.2°C' : '21.4°C'}`, w - 85, 18);

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [coldSpotActive, palette, contrast]);

    return (
        <div className="bg-ghost-card border border-ghost-border rounded-xl p-4 flex flex-col items-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs font-mono mb-2 text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                    THERMAL FLIR OPTICS
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPalette(palette === 'ironbow' ? 'nightvision' : 'ironbow')}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700 font-mono"
                    >
                        MODE: {palette.toUpperCase()}
                    </button>
                </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-inner">
                <canvas
                    ref={canvasRef}
                    width={280}
                    height={180}
                    className="block bg-black"
                />
                {coldSpotActive && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500 text-blue-300 text-[10px] font-mono animate-pulse">
                        CRYOGENIC SINK DETECTED
                    </div>
                )}
            </div>

            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
                <span>SENSOR: IR-GRID-64</span>
                <span>FOV: 55° NOCTURNAL</span>
            </div>
        </div>
    );
}
