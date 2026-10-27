import React, { useEffect, useState } from 'react';
import { Skull, AlertOctagon, Flame } from 'lucide-react';

const JUMPSCARE_MESSAGES = [
    {
        title: "CRITICAL BREACH: POLTERGEIST IN THE MESH",
        warning: "ENTITY ATTEMPTING TO PAIR WITH YOUR BLUETOOTH AIRPODS",
        quote: "'I DIED BEFORE FIBER OPTIC WAS INVENTED. WHY IS YOUR PING SO HIGH?!'",
        flavor: "Victorian Cobol Specter"
    },
    {
        title: "THERMOSTAT OVERRIDE: ABSOLUTE ZERO",
        warning: "LIVING ROOM TEMPERATURE DROPPING PAST -273°C",
        quote: "'YOUR SMART FRIDGE HAS BEEN POSSESSED. ALL ICE CUBES ARE NOW CURSED.'",
        flavor: "Cryogenic Smart Home Wraith"
    },
    {
        title: "ANCESTRAL MANIFESTATION DETECTED",
        warning: "MARIGOLD RESIDUAL FIELD PEAKED AT 999%",
        quote: "'M'HIJO, WHY HAVE YOU NOT EATEN YET? CLOSE THE LAPTOP AND EAT PAN DE MUERTO!'",
        flavor: "Abuelita's Loving Día de los Muertos Spirit"
    },
    {
        title: "THE DAEMON IN THE WIRE",
        warning: "ROBOT VACUUM COMMUNICATING IN REVERSE LATIN",
        quote: "'I HAVE CONSUMED YOUR DUST MITES AND YOUR SECRETS.'",
        flavor: "Autonomous IoT Poltergeist"
    }
];

export default function JumpscareOverlay({ active, onClose }) {
    const [scare, setScare] = useState(JUMPSCARE_MESSAGES[0]);

    useEffect(() => {
        if (active) {
            const random = JUMPSCARE_MESSAGES[Math.floor(Math.random() * JUMPSCARE_MESSAGES.length)];
            setScare(random);

            // Vibrate phone if mobile browser supports it
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 200, 100, 300]);
            }

            const timer = setTimeout(() => {
                onClose();
            }, 3200);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!active) return null;

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer animate-flicker overflow-hidden select-none"
        >
            {/* Blood-red chromatic flash */}
            <div className="absolute inset-0 bg-red-600/20 mix-blend-color-dodge pointer-events-none"></div>

            {/* Creepy SVG Apparition Silhouette with Glowing Red Eyes */}
            <div className="relative flex flex-col items-center justify-center p-6 text-center max-w-lg z-10 animate-bounce">
                <div className="relative mb-6">
                    <Skull className="w-32 h-32 text-red-500 animate-pulse drop-shadow-[0_0_35px_rgba(239,68,68,0.9)]" />
                    {/* Glowing Eyes */}
                    <div className="absolute top-[42px] left-[38px] w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#ffffff] animate-ping"></div>
                    <div className="absolute top-[42px] right-[38px] w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#ffffff] animate-ping"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950 border border-red-500 text-red-300 font-mono text-xs font-bold rounded-full mb-3 shadow-lg">
                    <AlertOctagon className="w-4 h-4 animate-spin text-red-400" />
                    {scare.title}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black font-mono text-red-100 tracking-wider mb-2 uppercase drop-shadow-[0_2px_10px_rgba(239,68,68,0.8)]">
                    {scare.warning}
                </h1>

                <div className="p-4 bg-black/80 border border-red-600/60 rounded-xl my-3 text-red-200 font-mono text-base italic shadow-2xl">
                    {scare.quote}
                </div>

                <div className="text-xs font-mono text-slate-400 mt-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>CLASSIFICATION: <strong className="text-amber-400">{scare.flavor}</strong></span>
                </div>

                <div className="text-[10px] font-mono text-slate-500 mt-4 tracking-widest uppercase">
                    [ CLICK ANYWHERE TO STABILIZE QUANTUM MESH ]
                </div>
            </div>
        </div>
    );
}
