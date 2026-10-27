import React, { useState } from 'react';
import { FileText, Volume2, ShieldAlert, Cpu, Download, Sparkles, Skull, CheckCircle2 } from 'lucide-react';
import { evpSound } from '../utils/evpAudio';
import confetti from 'canvas-confetti';

export default function GemmaDossier({ dossier, analysis, onExport }) {
    const [isPlayingEvp, setIsPlayingEvp] = useState(false);

    if (!dossier || !analysis) {
        return (
            <div className="bg-ghost-card border border-ghost-border rounded-xl p-8 text-center text-slate-500 font-mono">
                <Skull className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
                No active spectral casefile loaded. Select a haunted scenario or initiate live telemetry sweep above.
            </div>
        );
    }

    const isAncestral = analysis.entity?.type?.includes("Ancestral");

    const handlePlayEvp = () => {
        setIsPlayingEvp(true);
        evpSound.playSpiritBurst(isAncestral);

        if (isAncestral) {
            // Drop marigold petals celebration for Día de los Muertos!
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#f59e0b', '#fbbf24', '#d97706', '#ec4899']
            });
        }

        setTimeout(() => {
            setIsPlayingEvp(false);
        }, 2600);
    };

    return (
        <div className="bg-ghost-card border border-ghost-border rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header / Casefile Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${isAncestral ? 'bg-amber-950/40 border-amber-600/50 text-amber-400' : 'bg-purple-950/40 border-purple-600/50 text-purple-400'}`}>
                        {isAncestral ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Skull className="w-6 h-6 animate-pulse" />}
                    </div>
                    <div>
                        <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                            OPEN-WEIGHT NEURAL FORENSICS
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
                            {dossier.dossierTitle}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded border ${
                        analysis.paranormalIndex > 75 
                            ? 'bg-red-950/70 text-red-300 border-red-700 animate-pulse' 
                            : (isAncestral ? 'bg-amber-950/70 text-amber-300 border-amber-700' : 'bg-purple-950/70 text-purple-300 border-purple-700')
                    }`}>
                        {analysis.threatLevel}
                    </span>
                    <button
                        onClick={onExport}
                        className="px-3 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
                        title="Export Markdown Casefile for DEV submission"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        Export
                    </button>
                </div>
            </div>

            {/* AI Forensic Investigator Notes */}
            <div className="mt-5 space-y-4">
                <div className="p-4 rounded-lg bg-ghost-dark/80 border border-slate-800 font-mono text-sm leading-relaxed text-slate-300">
                    <div className="text-xs text-purple-400 font-semibold mb-1 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        {dossier.sourceModel}
                    </div>
                    <p className="italic">
                        "{dossier.investigatorSummary}"
                    </p>
                </div>

                {/* EVP Voice Box Audio Player */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-950/20 to-slate-900 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={handlePlayEvp}
                            disabled={isPlayingEvp}
                            className={`p-3 rounded-xl font-mono text-xs flex items-center gap-2 border transition-all ${
                                isPlayingEvp 
                                    ? 'bg-purple-600 text-white border-purple-400 scale-95 shadow-lg shadow-purple-900/50' 
                                    : 'bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 border-purple-600/60'
                            }`}
                        >
                            <Volume2 className={`w-5 h-5 ${isPlayingEvp ? 'animate-ping' : ''}`} />
                            {isPlayingEvp ? 'PLAYING EVP...' : 'LISTEN TO SPIRIT EVP'}
                        </button>
                        <div>
                            <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                                DECODED AUDIO FREQUENCY (EVP)
                            </div>
                            <div className="text-sm font-mono text-slate-200 mt-0.5 italic">
                                {dossier.evpTranscription}
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                        BANDPASS: 432 Hz - 110 Hz
                    </div>
                </div>

                {/* Spectral Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-500 text-[10px]">THERMAL SINK</div>
                        <div className="text-cyan-400 font-bold text-sm mt-0.5">{analysis.metrics.coldSpotDepth}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-500 text-[10px]">PEAK FLUX</div>
                        <div className="text-purple-400 font-bold text-sm mt-0.5">{analysis.metrics.peakEmf}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-500 text-[10px]">ACOUSTIC BURST</div>
                        <div className="text-red-400 font-bold text-sm mt-0.5">{analysis.metrics.peakAcoustic}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-500 text-[10px]">WITCHING INDEX</div>
                        <div className="text-amber-400 font-bold text-sm mt-0.5">{analysis.paranormalIndex} / 100</div>
                    </div>
                </div>

                {/* Containment Protocol / Remembrance */}
                <div className={`p-4 rounded-lg border font-mono text-xs ${
                    isAncestral 
                        ? 'bg-amber-950/20 border-amber-600/40 text-amber-200' 
                        : 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
                }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4" />
                        {isAncestral ? 'DÍA DE LOS MUERTOS OFRENDA PROTOCOL' : 'STANDARD HALLOWEEN CONTAINMENT PROCEDURE'}
                    </div>
                    <p className="text-slate-300 leading-normal">
                        {dossier.containmentProtocol}
                    </p>
                </div>

                {/* Why Open Innovation Matters (DEV Challenge Core Requirement) */}
                <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-800/40 text-xs font-mono text-blue-200">
                    <div className="font-semibold text-blue-400 flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Why Open-Source AI Matters for This Project:
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                        {dossier.openInnovationStatement}
                    </p>
                </div>
            </div>
        </div>
    );
}
