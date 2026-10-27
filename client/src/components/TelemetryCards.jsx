import React from 'react';
import { Thermometer, Zap, Activity, Waves, Gauge, Skull, Sparkles } from 'lucide-react';

export default function TelemetryCards({ currentReading, analysis }) {
    if (!currentReading) return null;

    const { temp, emf, acoustic, vibration, pressure } = currentReading;
    const isColdSpot = temp < 15.0;
    const isHighEmf = emf > 50.0;
    const isHighNoise = acoustic > 50.0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Temperature / Cold Spot */}
            <div className={`p-4 rounded-xl border transition-all ${isColdSpot ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-900/30' : 'bg-ghost-card border-ghost-border'}`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1.5">
                        <Thermometer className={`w-4 h-4 ${isColdSpot ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
                        TEMPERATURE
                    </span>
                    {isColdSpot && <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">COLD SPOT</span>}
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
                    {temp}°C
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                    {analysis?.metrics?.coldSpotDepth ? `Peak Delta: ${analysis.metrics.coldSpotDepth}` : 'Normal range (18-22°C)'}
                </div>
            </div>

            {/* Electromagnetic Field (EMF) */}
            <div className={`p-4 rounded-xl border transition-all ${isHighEmf ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-900/30' : 'bg-ghost-card border-ghost-border'}`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1.5">
                        <Zap className={`w-4 h-4 ${isHighEmf ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
                        EMF FLUX
                    </span>
                    {isHighEmf && <span className="text-[10px] text-purple-300 font-bold bg-purple-950 px-1.5 py-0.5 rounded border border-purple-700">ENTITY SURGE</span>}
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
                    {emf} <span className="text-xs text-slate-400 font-normal">mG</span>
                </div>
                {/* EMF Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${isHighEmf ? 'bg-purple-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (emf / 100) * 100)}%` }}
                    />
                </div>
            </div>

            {/* Acoustic / EVP Sound Level */}
            <div className={`p-4 rounded-xl border transition-all ${isHighNoise ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-900/30' : 'bg-ghost-card border-ghost-border'}`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1.5">
                        <Waves className={`w-4 h-4 ${isHighNoise ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
                        ACOUSTIC / EVP
                    </span>
                    {isHighNoise && <span className="text-[10px] text-red-300 font-bold bg-red-950 px-1.5 py-0.5 rounded border border-red-700">AUDIO SPIKE</span>}
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
                    {acoustic} <span className="text-xs text-slate-400 font-normal">dB</span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                    Baseline: 15-25 dB (Sub-audible)
                </div>
            </div>

            {/* Kinetic Vibration */}
            <div className="p-4 rounded-xl border bg-ghost-card border-ghost-border">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        KINETIC SEISMIC
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Z-AXIS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
                    {vibration} <span className="text-xs text-slate-400 font-normal">G</span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                    Threshold: &gt; 0.5G = Poltergeist
                </div>
            </div>
        </div>
    );
}
