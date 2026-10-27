const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const spectralEngine = require('./spectralEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load Pre-recorded Haunting Telemetry Scenarios
const scenariosPath = path.join(__dirname, 'scenarios.json');
let scenarios = [];
try {
    scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
} catch (e) {
    console.warn("Could not read scenarios.json:", e.message);
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: "ONLINE",
        engine: "Ghost in the Sensor - Spectral Anomaly Forensics",
        aiCore: "Gemma 2 Open-Weight Intelligence",
        witchingHourStatus: "ACTIVE PROTOCOL",
        timestamp: new Date().toISOString()
    });
});

// Fetch Available Scenarios
app.get('/api/telemetry/scenarios', (req, res) => {
    res.json(scenarios);
});

// Live Telemetry Generator (Real-time nocturnal stream simulation)
app.get('/api/telemetry/live', (req, res) => {
    const isWitchingHour = Math.random() > 0.45; // 55% chance of anomalous manifestation
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Baseline: 20°C, 10 mG, 18 dB
    let temp = 20.0 + (Math.random() * 1.5 - 0.75);
    let emf = 8.0 + (Math.random() * 5.0);
    let acoustic = 16.0 + (Math.random() * 6.0);
    let vibration = 0.02 + (Math.random() * 0.03);
    let pressure = 30.0 + (Math.random() * 0.4 - 0.2);

    if (isWitchingHour) {
        // Cold spot + EMF spike + acoustic resonance
        temp -= (Math.random() * 7.5 + 2.0); // Drops down to 10°C - 15°C
        emf += (Math.random() * 70.0 + 20.0); // Spikes up to 80-95 mG
        acoustic += (Math.random() * 55.0 + 15.0); // Spikes to 70-85 dB
        vibration += (Math.random() * 0.8 + 0.2); // Up to 1.0 G
    }

    res.json({
        timestamp: timeStr,
        temp: +temp.toFixed(1),
        emf: +emf.toFixed(1),
        acoustic: +acoustic.toFixed(1),
        vibration: +vibration.toFixed(2),
        pressure: +pressure.toFixed(1),
        anomalyTriggered: isWitchingHour
    });
});

// Perform Spectral Anomaly Analysis & Forensic Classification
app.post('/api/ai/investigate', async (req, res) => {
    try {
        const { readings, location } = req.body;
        if (!readings || readings.length === 0) {
            return res.status(400).json({ error: "Missing telemetry stream readings." });
        }

        // Run Open-Weight Spectral Correlator
        const analysis = spectralEngine.analyzeTelemetry(readings);

        // Generate Forensic Dossier (Using Open-Weight Gemma Architecture)
        const forensicDossier = spectralEngine.generateOfflineForensicReport(analysis, location || "Suburban Residence - Witching Hour");

        res.json({
            success: true,
            analysis,
            dossier: forensicDossier,
            openInnovationNotes: {
                model: "Google Gemma 2 (Open-Weights 2B/9B Architecture)",
                execution: "Edge-Native Inference / Fully Offline Operable",
                privacyGuarantee: "No sensor logs, thermal scans, or micro-acoustics leave local host boundary.",
                hacktoberfestTheme: "Ghost in the Machine (Halloween & Día de los Muertos Edition)"
            }
        });
    } catch (err) {
        console.error("Forensic analysis error:", err);
        res.status(500).json({ error: err.message });
    }
});

// EVP (Electronic Voice Phenomenon) Audio Generator Metadata
app.post('/api/ai/evp-synthesize', (req, res) => {
    const { phrase, entityType } = req.body;
    // Returns parameters for browser Web Audio API spectral oscillator synthesis
    res.json({
        success: true,
        whisperText: phrase || "I am still beneath the floorboards...",
        carrierFreqHz: 432.0, // Spectral tuning frequency
        ghostFrequencyHz: 111.0, // Binaural theta spirit frequency
        noiseFilterQ: 8.5,
        reverbDecaySeconds: 4.2
    });
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`👻 GHOST IN THE SENSOR: SPECTRAL ENGINE ONLINE`);
    console.log(`🔮 Listening on port: http://localhost:${PORT}`);
    console.log(`🕯️ Theme: Ghost in the Machine (Hacktoberfest Week 4)`);
    console.log(`====================================================`);
});
