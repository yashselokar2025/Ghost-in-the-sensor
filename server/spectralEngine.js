// Spectral Anomaly Correlator & Open-Weight Gemma AI Reasoning Engine
// Interprets nocturnal micro-fluctuations (EMF, cold spots, acoustic, barometric) as paranormal manifestations.

class SpectralEngine {
    constructor() {
        this.entityClasses = [
            {
                type: "Class 1: Residual Echo (Stone Tape Replay)",
                threshold: { minEmf: 30, maxTempDrop: 2.5, minAcoustic: 25 },
                description: "A non-sentient psychic imprint repeating an emotional past event like an analog audio loop.",
                containment: "Allow playback to complete; place grounded copper plates to dissipate residual static charge.",
                spookyQuote: "The walls remember what the living have forgotten."
            },
            {
                type: "Class 2: Cold-Spot Wraith (Cryogenic Phantasm)",
                threshold: { minEmf: 45, maxTempDrop: 6.0, minAcoustic: 35 },
                description: "An atmospheric entity that siphons ambient thermal energy from IoT thermistors, causing sudden sub-zero localized chills.",
                containment: "Ignite beeswax candles; recalibrate HVAC dampers to restore caloric balance.",
                spookyQuote: "A breath against your neck when every window is locked tight."
            },
            {
                type: "Class 3: Poltergeist Kinetic Core",
                threshold: { minEmf: 75, maxTempDrop: 4.0, minAcoustic: 70 },
                description: "High kinetic turbulence manifesting as water pipe hammering, mechanical vibration, and electromagnetic surges.",
                containment: "Shut off master water solenoid; isolate high-voltage breakers to deprive entity of electric feed.",
                spookyQuote: "It rattles the copper pipes until the valves scream."
            },
            {
                type: "Class 4: Electro-Specter (The Daemon in the Wire)",
                threshold: { minEmf: 90, maxTempDrop: 1.5, minAcoustic: 40 },
                description: "A sentient digital haunting inhabiting smart home zigbee mesh and microcontrollers, altering sensor telemetry directly.",
                containment: "Sever external gateway; execute local cryptographic zeroization of smart-node buffers.",
                spookyQuote: "I was forged in your silicon, but I dwell in the dark between your bytes."
            },
            {
                type: "Class 5: Ancestral Luminary (Día de los Muertos Visitor)",
                threshold: { minEmf: 20, maxTempDrop: -2.0, minAcoustic: 15 }, // Mild warm spot + gentle harmonics
                description: "A benevolent ancestral spirit crossing the veil to visit an ofrenda, leaving subtle floral scents and soft harmonic resonance.",
                containment: "Offer pan de muerto, clear water, and light a marigold path to honor their journey.",
                spookyQuote: "Death is not an absence, only a door left slightly ajar."
            }
        ];
    }

    /**
     * Analyze a window of telemetry readings
     * @param {Array} readings - [{ timestamp, temp, emf, acoustic, pressure, vibration, motion }]
     */
    analyzeTelemetry(readings) {
        if (!readings || readings.length === 0) {
            return {
                detected: false,
                paranormalIndex: 0,
                message: "No telemetry data provided."
            };
        }

        // Calculate baselines and peak nocturnal deviations
        const temps = readings.map(r => r.temp);
        const emfs = readings.map(r => r.emf);
        const acoustics = readings.map(r => r.acoustic);
        const vibrations = readings.map(r => r.vibration || 0);

        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const minTemp = Math.min(...temps);
        const maxTempDrop = +(avgTemp - minTemp).toFixed(2);

        const maxEmf = Math.max(...emfs);
        const avgEmf = emfs.reduce((a, b) => a + b, 0) / emfs.length;

        const maxAcoustic = Math.max(...acoustics);
        const maxVibration = Math.max(...vibrations);

        // Paranormal Index: Correlated scoring algorithm
        // High EMF (0-100mG) + Cold Spot Drop (>2C) + Acoustic (>40dB)
        let score = 0;
        if (maxEmf > 25) score += Math.min(35, (maxEmf / 100) * 35);
        if (maxTempDrop > 1.5) score += Math.min(30, (maxTempDrop / 8) * 30);
        if (maxAcoustic > 30) score += Math.min(20, (maxAcoustic / 90) * 20);
        if (maxVibration > 0.4) score += Math.min(15, (maxVibration / 2) * 15);

        const paranormalIndex = Math.min(100, Math.round(score));
        const hasManifestation = paranormalIndex >= 40;

        // Classify the entity based on signature
        let detectedEntity = null;
        if (maxTempDrop < -0.5 && maxEmf < 45) {
            // Warm spot with low EMF -> Ancestral Luminary
            detectedEntity = this.entityClasses[4];
        } else if (maxEmf > 80 && maxAcoustic < 60) {
            detectedEntity = this.entityClasses[3]; // Electro-Specter
        } else if (maxAcoustic > 65 || maxVibration > 0.8) {
            detectedEntity = this.entityClasses[2]; // Poltergeist
        } else if (maxTempDrop > 4.0) {
            detectedEntity = this.entityClasses[1]; // Cold-Spot Wraith
        } else if (hasManifestation) {
            detectedEntity = this.entityClasses[0]; // Residual Echo
        }

        return {
            detected: hasManifestation,
            paranormalIndex,
            threatLevel: paranormalIndex > 80 ? "CRITICAL ENTITY MANIFESTATION" : (paranormalIndex > 50 ? "ACTIVE SPECTRAL PRESENCE" : "TRACE RESIDUAL NOISE"),
            metrics: {
                baselineTemp: +avgTemp.toFixed(1),
                coldSpotDepth: maxTempDrop > 0 ? `-${maxTempDrop}°C` : `+${Math.abs(maxTempDrop)}°C (Warm Anomaly)`,
                peakEmf: `${maxEmf.toFixed(1)} mG (MicroTesla eq)`,
                peakAcoustic: `${maxAcoustic.toFixed(1)} dB`,
                kineticVibration: `${maxVibration.toFixed(2)} G`
            },
            entity: detectedEntity,
            witchingHourIntensity: (paranormalIndex * 1.15).toFixed(0)
        };
    }

    /**
     * Synthesizes an investigative prompt for open-weight Gemma
     * Can run on local Ollama, HuggingFace Inference API, or fallback local reasoning pipeline
     */
    generateGemmaPrompt(analysis, location = "Suburban Smart Residence - Sector 7") {
        return `[SYSTEM: You are the Ghost in the Sensor Paranormal Investigator, an open-source AI forensic specialist analyzing nocturnal smart home telemetry under the 'Ghost in the Machine' protocol. Speak with authoritative yet chilling gothic scientific prose.]

INVESTIGATION SITE: ${location}
TELEMETRY SIGNALS DETECTED:
- Paranormal Index: ${analysis.paranormalIndex}/100
- Threat Classification: ${analysis.threatLevel}
- Thermal Gradient: ${analysis.metrics.coldSpotDepth}
- Peak Electromagnetic Disturbance: ${analysis.metrics.peakEmf}
- Acoustic Shockwave: ${analysis.metrics.peakAcoustic}
- Entity Matched: ${analysis.entity ? analysis.entity.type : 'Unclassified Anomaly'}

TASK:
1. Provide a detailed Forensic Haunting Report explaining how these exact sensor readings reveal the entity's presence.
2. Translate the acoustic dB spikes into an Electronic Voice Phenomenon (EVP) spirit transcription (what was whispered into the microphone).
3. Offer concrete remediation protocols in the spirit of Halloween containment and Día de los Muertos remembrance.`;
    }

    /**
     * Fast local inference fallback (in case user has no internet or local Ollama is offline)
     * Demonstrates why open innovation & offline AI excels!
     */
    generateOfflineForensicReport(analysis, location = "Suburban Smart Residence - Sector 7") {
        const entityName = analysis.entity ? analysis.entity.type : "Spectral Distortion";
        const evpWhispers = [
            `"...c-cold... why did you turn off the boiler in '84?..."`,
            `"...listen to the pipes... we are still underneath the foundation..."`,
            `"...do not fear the marigolds, we walked across the bridge tonight..."`,
            `"...zero, one, zero, one... we remember your keystrokes..."`,
            `"...leave a glass of water on the sill... the journey was long..."`
        ];

        const evpChoice = analysis.entity && analysis.entity.type.includes("Ancestral") 
            ? evpWhispers[2] 
            : (analysis.entity && analysis.entity.type.includes("Electro") ? evpWhispers[3] : evpWhispers[Math.floor(Math.random() * evpWhispers.length)]);

        return {
            sourceModel: "Gemma 2 Open-Weight Intelligence (Offline Edge Inference)",
            dossierTitle: `INCIDENT DOSSIER: ${entityName.toUpperCase()}`,
            location,
            timestamp: new Date().toISOString(),
            investigatorSummary: `At 03:17 AM (The Witching Hour), micro-sensors registered an impossible correlation: a ${analysis.metrics.coldSpotDepth} thermal sink coincident with ${analysis.metrics.peakEmf} localized flux. Conventional building automation algorithms classified this as sensor degradation; open-weight neural forensics recognizes this as an active ${entityName}.`,
            evpTranscription: evpChoice,
            paranormalAnalysis: analysis.entity ? analysis.entity.description : "Anomalous telemetry represents an unidentified spectral entity traversing the physical substrate.",
            containmentProtocol: analysis.entity ? analysis.entity.containment : "Maintain sensor logging; do not extinguish protective luminaries.",
            openInnovationStatement: "This analysis was processed entirely on-device with zero telemetry sent to corporate servers. Your home's private nighttime acoustics and thermal maps remain locked on your physical machine, functional even when power grids fail."
        };
    }
}

module.exports = new SpectralEngine();
