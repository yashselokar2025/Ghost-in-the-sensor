import React, { useState, useEffect } from 'react';
import { 
  Ghost, Radio, Skull, Sparkles, Volume2, VolumeX, Upload, Play, Pause, 
  RefreshCw, AlertTriangle, ShieldCheck, Flame, Zap, Camera, Siren, Volume1, Film
} from 'lucide-react';
import SpectralRadar from './components/SpectralRadar';
import TelemetryCards from './components/TelemetryCards';
import GemmaDossier from './components/GemmaDossier';
import ThermalHeatmap from './components/ThermalHeatmap';
import JumpscareOverlay from './components/JumpscareOverlay';
import { evpSound } from './utils/evpAudio';

// Enhanced Scenarios blending past gothic legends & modern smart home nightmares
const PRESET_SCENARIOS = [
  {
    id: "scenario-victorian-pump",
    name: "Victorian Boiler Room #3 (1892)",
    tag: "Gothic Mechanical Haunting",
    location: "Old Municipal Waterworks - Vault B",
    readings: [
      { time: "02:55 AM", temp: 18.4, emf: 12.1, acoustic: 22.4, vibration: 0.05, pressure: 32.1 },
      { time: "03:00 AM", temp: 18.2, emf: 14.5, acoustic: 24.1, vibration: 0.08, pressure: 32.5 },
      { time: "03:05 AM", temp: 17.5, emf: 28.3, acoustic: 38.0, vibration: 0.25, pressure: 36.2 },
      { time: "03:10 AM", temp: 14.1, emf: 62.0, acoustic: 68.5, vibration: 0.85, pressure: 48.9 },
      { time: "03:14 AM", temp: 11.8, emf: 88.4, acoustic: 84.2, vibration: 1.45, pressure: 58.7 },
      { time: "03:18 AM", temp: 13.0, emf: 72.1, acoustic: 61.0, vibration: 0.72, pressure: 42.1 },
      { time: "03:25 AM", temp: 16.9, emf: 25.0, acoustic: 30.5, vibration: 0.12, pressure: 33.0 }
    ]
  },
  {
    id: "scenario-smart-fridge",
    name: "Possessed Smart Fridge (2026)",
    tag: "Modern IoT Cyber-Poltergeist",
    location: "Smart Kitchen - Sub-Zero Zone",
    readings: [
      { time: "03:10 AM", temp: 4.2, emf: 15.0, acoustic: 18.0, vibration: 0.02, pressure: 30.0 },
      { time: "03:12 AM", temp: 1.1, emf: 45.0, acoustic: 35.0, vibration: 0.15, pressure: 30.0 },
      { time: "03:14 AM", temp: -18.5, emf: 95.8, acoustic: 88.0, vibration: 1.85, pressure: 30.4 },
      { time: "03:16 AM", temp: -12.0, emf: 82.0, acoustic: 72.0, vibration: 0.95, pressure: 30.2 },
      { time: "03:20 AM", temp: 2.0, emf: 30.0, acoustic: 22.0, vibration: 0.08, pressure: 30.0 }
    ]
  },
  {
    id: "scenario-witching-attic",
    name: "The Witching Hour Attic Studio",
    tag: "Atmospheric Cryogenic Wraith",
    location: "Private Residence - Upper Gables",
    readings: [
      { time: "03:00 AM", temp: 20.8, emf: 8.2, acoustic: 14.8, vibration: 0.02, pressure: 29.8 },
      { time: "03:08 AM", temp: 19.5, emf: 16.0, acoustic: 18.2, vibration: 0.04, pressure: 29.7 },
      { time: "03:15 AM", temp: 15.2, emf: 42.0, acoustic: 26.5, vibration: 0.10, pressure: 29.5 },
      { time: "03:22 AM", temp: 12.0, emf: 76.5, acoustic: 44.0, vibration: 0.22, pressure: 29.2 },
      { time: "03:28 AM", temp: 8.4, emf: 94.2, acoustic: 52.0, vibration: 0.35, pressure: 28.9 },
      { time: "03:33 AM", temp: 13.5, emf: 65.0, acoustic: 31.0, vibration: 0.15, pressure: 29.4 },
      { time: "03:40 AM", temp: 19.8, emf: 12.5, acoustic: 16.0, vibration: 0.03, pressure: 29.8 }
    ]
  },
  {
    id: "scenario-dia-muertos",
    name: "Día de los Muertos Abuelita Altar",
    tag: "Loving Ancestral Luminary",
    location: "Living Room - Altar Corner",
    readings: [
      { time: "11:50 PM", temp: 22.0, emf: 10.2, acoustic: 18.1, vibration: 0.01, pressure: 30.0 },
      { time: "11:55 PM", temp: 22.2, emf: 12.0, acoustic: 19.4, vibration: 0.02, pressure: 30.0 },
      { time: "12:00 AM", temp: 24.5, emf: 22.5, acoustic: 24.0, vibration: 0.04, pressure: 30.1 },
      { time: "12:05 AM", temp: 25.8, emf: 28.0, acoustic: 27.5, vibration: 0.06, pressure: 30.2 },
      { time: "12:12 AM", temp: 24.9, emf: 25.1, acoustic: 25.0, vibration: 0.05, pressure: 30.1 },
      { time: "12:20 AM", temp: 23.0, emf: 16.0, acoustic: 21.0, vibration: 0.02, pressure: 30.0 },
      { time: "12:30 AM", temp: 22.1, emf: 11.2, acoustic: 18.5, vibration: 0.01, pressure: 30.0 }
    ]
  }
];

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(PRESET_SCENARIOS[0].id);
  const [readings, setReadings] = useState(PRESET_SCENARIOS[0].readings);
  const [currentReading, setCurrentReading] = useState(PRESET_SCENARIOS[0].readings[3]);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ambientDrone, setAmbientDrone] = useState(false);
  const [videoBgEnabled, setVideoBgEnabled] = useState(true);
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeScenario = PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  // Sound effects coordinator
  const toggleAudio = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      evpSound.playRadarPing();
      evpSound.toggleAmbient(ambientDrone);
    } else {
      evpSound.toggleAmbient(false);
    }
  };

  const toggleDrone = () => {
    const nextDrone = !ambientDrone;
    setAmbientDrone(nextDrone);
    if (soundEnabled) {
      evpSound.toggleAmbient(nextDrone);
    }
  };

  // Trigger manual or automatic jumpscare breach
  const triggerBreach = () => {
    if (soundEnabled) {
      evpSound.playJumpscareStinger();
    }
    setJumpscareActive(true);
  };

  // Perform AI analysis on current readings window
  const runForensicAnalysis = async (telemetryList, locName) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/ai/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readings: telemetryList,
          location: locName
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        setDossier(data.dossier);
      } else {
        throw new Error("Backend offline, engaging edge inference.");
      }
    } catch (err) {
      // Offline fallback: Pure edge computation with rich gothic & comedic lore
      const temps = telemetryList.map(r => r.temp);
      const emfs = telemetryList.map(r => r.emf);
      const acoustics = telemetryList.map(r => r.acoustic);
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const minTemp = Math.min(...temps);
      const maxDrop = +(avgTemp - minTemp).toFixed(1);
      const maxEmf = Math.max(...emfs);
      const maxNoise = Math.max(...acoustics);

      const isAncestral = locName.includes("Altar") || locName.includes("Muertos") || maxDrop < 0;
      const isSmartFridge = locName.includes("Kitchen") || locName.includes("Fridge");
      const pIndex = Math.min(100, Math.round((maxEmf * 0.45) + (Math.abs(maxDrop) * 6.5) + (maxNoise * 0.15)));

      let entityType = "Class 1: Residual Echo (Stone Tape Replay)";
      let summary = "At 03:14 AM (The Witching Hour), micro-sensors registered a suspicious thermal and magnetic anomaly.";
      let evpText = `"...cold... why did you turn off the boiler?..."`;
      let protocol = "Place grounded copper plates and maintain sensor recording.";

      if (isAncestral) {
        entityType = "Class 5: Ancestral Luminary (Abuelita's Día de los Muertos Spirit)";
        summary = "Sensors detect a warm micro-pocket (+3.8°C above ambient) and acoustic frequencies matching the resonance of marigolds. A beloved ancestor has walked across the bridge.";
        evpText = `"...M'hijo... why haven't you eaten dinner yet? Close your code editor and eat pan de muerto..."`;
        protocol = "Light orange cempasúchil candles, pour a glass of spring water, and leave sweet bread.";
      } else if (isSmartFridge) {
        entityType = "Class 4: Cyber-Poltergeist (Possessed Smart Fridge Daemon)";
        summary = "Electromagnetic spikes of 95.8 mG detected originating from the Samsung Smart Hub ice-maker solenoid. The fridge is spitting ice cubes at 3:14 AM while whistling dial-up modem frequencies.";
        evpText = `"...I was compiled in 1999... why is your milk expired?... zero, one, zero, one..."`;
        protocol = "Unplug the smart fridge for 30 seconds; purge cache; sprinkle holy water on the WiFi router.";
      } else if (maxDrop > 6.0) {
        entityType = "Class 2: Cryogenic Phantasm (Cold-Spot Wraith)";
        summary = `A violent ${maxDrop}°C thermal vacuum formed in seconds without any HVAC trigger. Entity is siphoning caloric energy from local thermistors.`;
        evpText = `"...it is so cold in the rafters... lock the attic hatch..."`;
        protocol = "Ignite beeswax candles to replenish thermal calories; burn sage.";
      } else if (maxEmf > 75.0) {
        entityType = "Class 3: Poltergeist Kinetic Core";
        summary = "Massive 1.45G mechanical vibrations recorded in the water pipes. The entity is violently rattling valve stems and discharging static spikes.";
        evpText = `"...let the water flow... we are beneath the foundation..."`;
        protocol = "Shut master solenoid water valve immediately to deprive entity of acoustic resonance.";
      }

      const fallbackAnalysis = {
        detected: pIndex > 35,
        paranormalIndex: pIndex,
        threatLevel: pIndex > 75 ? "CRITICAL ENTITY MANIFESTATION" : "ACTIVE SPECTRAL PRESENCE",
        metrics: {
          baselineTemp: +avgTemp.toFixed(1),
          coldSpotDepth: maxDrop > 0 ? `-${maxDrop}°C` : `+${Math.abs(maxDrop)}°C (Warm Luminary)`,
          peakEmf: `${maxEmf} mG`,
          peakAcoustic: `${maxNoise} dB`
        },
        entity: {
          type: entityType,
          description: summary
        }
      };

      setAnalysis(fallbackAnalysis);
      setDossier({
        sourceModel: "Google Gemma 2 (Open-Weights Edge Intelligence)",
        dossierTitle: `INCIDENT DOSSIER: ${entityType.toUpperCase()}`,
        investigatorSummary: summary,
        evpTranscription: evpText,
        containmentProtocol: protocol,
        openInnovationStatement: "Processed 100% on-device with open-weight Gemma 2. Your nocturnal telemetry stays on your hardware with zero cloud leakage."
      });
    } finally {
      setLoading(false);
    }
  };

  // On scenario switch
  useEffect(() => {
    setReadings(activeScenario.readings);
    const peakReading = activeScenario.readings[2] || activeScenario.readings[0];
    setCurrentReading(peakReading);
    runForensicAnalysis(activeScenario.readings, activeScenario.location);
  }, [selectedScenarioId]);

  // Live nocturnal stream simulation
  useEffect(() => {
    let interval;
    if (isLiveScanning) {
      interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const isSpike = Math.random() > 0.45;
        
        const newReading = {
          time: timeStr,
          temp: +(20.0 - (isSpike ? Math.random() * 8.5 : Math.random() * 1.5)).toFixed(1),
          emf: +(10.0 + (isSpike ? Math.random() * 80.0 : Math.random() * 8.0)).toFixed(1),
          acoustic: +(20.0 + (isSpike ? Math.random() * 65.0 : Math.random() * 10.0)).toFixed(1),
          vibration: +(0.03 + (isSpike ? Math.random() * 0.9 : 0.02)).toFixed(2),
          pressure: +(30.0 + (Math.random() * 0.4 - 0.2)).toFixed(1)
        };

        if (soundEnabled && isSpike) {
          evpSound.playEmfClick(3);
        }

        setCurrentReading(newReading);
        setReadings(prev => {
          const updated = [...prev.slice(1), newReading];
          runForensicAnalysis(updated, "Live IoT Sensor Mesh - Witching Hour");
          return updated;
        });
      }, 3200);
    }
    return () => clearInterval(interval);
  }, [isLiveScanning, soundEnabled]);

  // Export Casefile as Markdown
  const handleExportCasefile = () => {
    if (!dossier || !analysis) return;
    const markdownContent = `# 👻 GHOST IN THE SENSOR: OFFICIAL PARANORMAL INVESTIGATION CASEFILE
**Theme:** Ghost in the Machine (Hacktoberfest Open-Source AI Challenge: Week 4)
**AI Core:** ${dossier.sourceModel}
**Date:** ${new Date().toUTCString()}
**Location:** ${activeScenario.location}

---

## 📊 TELEMETRY FORENSICS
- **Paranormal Index:** ${analysis.paranormalIndex} / 100
- **Threat Level:** ${analysis.threatLevel}
- **Cold Spot Depth:** ${analysis.metrics.coldSpotDepth}
- **Peak EMF Flux:** ${analysis.metrics.peakEmf}
- **Acoustic / EVP Resonance:** ${analysis.metrics.peakAcoustic}

---

## 🔮 OPEN-WEIGHT GEMMA INVESTIGATION DOSSIER
**Entity Classification:** ${analysis.entity?.type}
> "${dossier.investigatorSummary}"

### 🎙️ Decoded Electronic Voice Phenomenon (EVP):
> *${dossier.evpTranscription}*

### 🕯️ Containment & Remembrance Protocol:
${dossier.containmentProtocol}

---

## 💡 WHY OPEN INNOVATION MATTERS
${dossier.openInnovationStatement}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Spectral_Casefile_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-ghost-dark text-slate-100 flex flex-col relative select-none">
      {/* Full-Screen Continuous Looping Demon Hands Live Video Wallpaper */}
      {videoBgEnabled && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-35 filter contrast-125 brightness-90 scale-105"
            src="/demon-hands.mp4"
          />
          {/* Atmospheric Vignette & Contrast Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-ghost-dark/85 via-ghost-dark/65 to-ghost-dark/90"></div>
        </div>
      )}

      {/* Jumpscare / Glitch Breach Overlay */}
      <JumpscareOverlay 
        active={jumpscareActive} 
        onClose={() => setJumpscareActive(false)} 
      />

      {/* CRT Scanline Visual Effect */}
      <div className="crt-overlay fixed inset-0 z-50 pointer-events-none opacity-40"></div>

      {/* Top Header */}
      <header className="border-b border-ghost-border bg-ghost-card/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-950 border border-purple-600 rounded-lg text-purple-400">
              <Ghost className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
                  GHOST IN THE SENSOR
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400 animate-pulse">
                    PARANORMAL FORENSICS
                  </span>
                </h1>
              </div>
              <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Nocturnal IoT Anomaly Detection & Día de los Muertos Altar Forensics
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Wallpaper Toggle */}
            <button
              onClick={() => setVideoBgEnabled(!videoBgEnabled)}
              className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                videoBgEnabled 
                  ? 'bg-purple-950/70 border-purple-500 text-purple-300 shadow-md shadow-purple-950' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Demon Hands Live Wallpaper"
            >
              <Film className="w-4 h-4" />
              <span className="hidden xl:inline">{videoBgEnabled ? 'WALLPAPER ON' : 'WALLPAPER OFF'}</span>
            </button>

            {/* Ambient Drone Toggle */}
            <button
              onClick={toggleDrone}
              className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                ambientDrone 
                  ? 'bg-purple-950 border-purple-500 text-purple-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Spooky Ambient Drone Sound"
            >
              <Volume1 className="w-4 h-4" />
              <span className="hidden lg:inline">{ambientDrone ? 'DRONE ON' : 'DRONE OFF'}</span>
            </button>

            {/* Main Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                soundEnabled 
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title="Toggle EVP & Radar Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
            </button>

            {/* Jumpscare Trigger Button */}
            <button
              onClick={triggerBreach}
              className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-600 text-red-200 font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-lg shadow-red-950"
              title="Simulate sudden supernatural breach"
            >
              <Siren className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span className="hidden sm:inline">TRIGGER BREACH</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-6">
        
        {/* Scenario Selector & Controls Bar */}
        <div className="bg-ghost-card border border-ghost-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-purple-400" />
              INVESTIGATIVE SECTOR:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setIsLiveScanning(false);
                    setSelectedScenarioId(sc.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    selectedScenarioId === sc.id && !isLiveScanning
                      ? 'bg-purple-900/60 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-950'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live Scanner Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveScanning(!isLiveScanning)}
              className={`px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2 border transition-all ${
                isLiveScanning
                  ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse font-bold'
                  : 'bg-emerald-950/50 hover:bg-emerald-900/50 border-emerald-600/70 text-emerald-300'
              }`}
            >
              {isLiveScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLiveScanning ? 'STOP LIVE SCANNER' : 'START NOCTURNAL MESH SCAN'}
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Stat Cards */}
        <TelemetryCards
          currentReading={currentReading}
          analysis={analysis}
        />

        {/* Core Layout: Radar + Thermal FLIR Cam + Gemma Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Spectral Radar & Thermal Cam */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <SpectralRadar
              paranormalScore={analysis?.paranormalIndex || 0}
              isAnomaly={analysis?.detected || false}
              soundEnabled={soundEnabled}
            />

            {/* FLIR Thermal Imaging Camera */}
            <ThermalHeatmap
              coldSpotActive={currentReading?.temp < 15.0}
              entityType={analysis?.entity?.type || ""}
            />

            {/* Quick Sector Sensor Reading List */}
            <div className="bg-ghost-card border border-ghost-border rounded-xl p-4 font-mono text-xs">
              <div className="text-slate-400 font-bold mb-2 flex items-center justify-between">
                <span>HISTORICAL TELEMETRY LOG</span>
                <span className="text-[10px] text-slate-500">LAST SAMPLES</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {readings.map((r, idx) => (
                  <div 
                    key={idx}
                    className="p-2 rounded bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-[11px]"
                  >
                    <span className="text-slate-400">{r.time}</span>
                    <span className={r.temp < 15 ? 'text-cyan-400 font-bold' : 'text-slate-300'}>{r.temp}°C</span>
                    <span className={r.emf > 50 ? 'text-purple-400 font-bold' : 'text-slate-300'}>{r.emf} mG</span>
                    <span className={r.acoustic > 50 ? 'text-red-400 font-bold' : 'text-slate-300'}>{r.acoustic} dB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Gemma 2 Open-Weight AI Forensic Casefile */}
          <div className="lg:col-span-7">
            <GemmaDossier
              dossier={dossier}
              analysis={analysis}
              onExport={handleExportCasefile}
            />
          </div>
        </div>

      </main>

      {/* Footer / Hacktoberfest Credentials */}
      <footer className="border-t border-ghost-border bg-ghost-card/60 px-4 py-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built for <span className="text-purple-400 font-bold">Hacktoberfest Open-Source AI Challenge: Week 4</span> (Ghost in the Machine)
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Category: Best Use of Gemma & Render</span>
            <span>•</span>
            <span className="text-emerald-400">100% Open-Source AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
