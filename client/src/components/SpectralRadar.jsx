import React, { useEffect, useRef } from 'react';
import { evpSound } from '../utils/evpAudio';

export default function SpectralRadar({ paranormalScore = 0, isAnomaly = false, soundEnabled = false }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let angle = 0;
        let animationFrameId;

        // Blips representation of spectral entities
        const blips = [
            { r: 85, theta: 0.8, size: 6, alpha: 0, life: 0 },
            { r: 130, theta: 2.4, size: 8, alpha: 0, life: 0 },
            { r: 50, theta: 4.1, size: 5, alpha: 0, life: 0 }
        ];

        let lastPing = 0;

        const render = (time) => {
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(centerX, centerY) - 15;

            // Clear with slight dark persistence trail
            ctx.fillStyle = 'rgba(7, 9, 14, 0.18)';
            ctx.fillRect(0, 0, width, height);

            // Draw concentric radar rings
            ctx.strokeStyle = isAnomaly ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.25)';
            ctx.lineWidth = 1;

            [0.25, 0.5, 0.75, 1.0].forEach(factor => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, maxRadius * factor, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Crosshairs
            ctx.beginPath();
            ctx.moveTo(centerX - maxRadius, centerY);
            ctx.lineTo(centerX + maxRadius, centerY);
            ctx.moveTo(centerX, centerY - maxRadius);
            ctx.lineTo(centerX, centerY + maxRadius);
            ctx.stroke();

            // Quadrant labels
            ctx.font = '10px ui-monospace, monospace';
            ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.fillText("N : ATTIC", centerX - 24, centerY - maxRadius + 12);
            ctx.fillText("S : BASEMENT", centerX - 35, centerY + maxRadius - 5);
            ctx.fillText("W : OFRENDA", centerX - maxRadius + 5, centerY - 5);
            ctx.fillText("E : PUMP", centerX + maxRadius - 45, centerY - 5);

            // Sweep Line
            angle = (angle + 0.035) % (Math.PI * 2);
            const sweepX = centerX + Math.cos(angle) * maxRadius;
            const sweepY = centerY + Math.sin(angle) * maxRadius;

            // Phosphor gradient behind sweep line
            const grad = ctx.createLinearGradient(centerX, centerY, sweepX, sweepY);
            if (isAnomaly) {
                grad.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
                grad.addColorStop(1, 'rgba(239, 68, 68, 0.4)');
            } else {
                grad.addColorStop(0, 'rgba(16, 185, 129, 0.0)');
                grad.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
            }

            ctx.strokeStyle = isAnomaly ? '#ef4444' : '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(sweepX, sweepY);
            ctx.stroke();

            // Radar Ping Sound
            if (soundEnabled && time - lastPing > 3000) {
                lastPing = time;
                evpSound.playRadarPing();
            }

            // Draw Spectral Blips when sweep passes near them
            blips.forEach(blip => {
                // Check if sweep line is close to blip theta
                const diff = Math.abs(angle - blip.theta);
                if (diff < 0.1 || Math.abs(diff - Math.PI * 2) < 0.1) {
                    blip.alpha = 1.0;
                }

                if (blip.alpha > 0.02) {
                    const bx = centerX + Math.cos(blip.theta) * blip.r;
                    const by = centerY + Math.sin(blip.theta) * blip.r;

                    ctx.fillStyle = isAnomaly ? `rgba(239, 68, 68, ${blip.alpha})` : `rgba(139, 92, 246, ${blip.alpha})`;
                    ctx.beginPath();
                    ctx.arc(bx, by, blip.size * (1 + (paranormalScore / 100)), 0, Math.PI * 2);
                    ctx.fill();

                    // Echo ring around blip
                    ctx.strokeStyle = isAnomaly ? `rgba(239, 68, 68, ${blip.alpha * 0.5})` : `rgba(16, 185, 129, ${blip.alpha * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(bx, by, blip.size * 2, 0, Math.PI * 2);
                    ctx.stroke();

                    blip.alpha *= 0.96; // Fade out slowly
                }
            });

            // Center Scanner Core
            ctx.fillStyle = isAnomaly ? '#ef4444' : '#10b981';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isAnomaly, paranormalScore, soundEnabled]);

    return (
        <div className="relative flex flex-col items-center justify-center p-4 bg-ghost-card border border-ghost-border rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute top-3 left-4 text-xs font-mono tracking-wider flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${isAnomaly ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                <span className={isAnomaly ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {isAnomaly ? 'SPECTRAL SIGNATURE LOCK' : 'SWEEPING LOCALIZED MESH'}
                </span>
            </div>
            <div className="absolute top-3 right-4 text-xs font-mono text-slate-400">
                SWEEP: 360° / 432Hz
            </div>

            <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className="max-w-full rounded-full border border-slate-800 bg-ghost-dark/70 shadow-inner mt-4"
            />

            <div className="mt-3 flex items-center justify-between w-full text-xs font-mono text-slate-400 px-2">
                <span>SECTOR RANGE: 25m</span>
                <span className="text-purple-400">EMF ANOMALY GAIN: {paranormalScore}%</span>
            </div>
        </div>
    );
}
