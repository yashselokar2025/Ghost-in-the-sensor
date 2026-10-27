// Native Web Audio API Spectral EVP Sound Synthesizer
// Generates eerie EVP static, spirit sweep frequencies, and ethereal resonant pulses completely offline!

class EvpSynthesizer {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play an eerie EVP spirit burst
    playSpiritBurst(isWarm = false) {
        this.init();
        const now = this.ctx.currentTime;
        const duration = 2.5;

        // 1. Noise Generator (Radio static / atmospheric white noise)
        const bufferSize = this.ctx.sampleRate * duration;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        // Filter: Bandpass swept to mimic EVP spirit box sweep
        const filter = this.ctx.createBiquadFilter();
        filter.type = isWarm ? "lowpass" : "bandpass";
        filter.frequency.setValueAtTime(isWarm ? 432 : 1200, now);
        filter.frequency.exponentialRampToValueAtTime(isWarm ? 528 : 250, now + duration);
        filter.Q.setValueAtTime(8, now);

        // 2. Spectral Sine Wave (Binaural ghost frequency)
        const osc = this.ctx.createOscillator();
        osc.type = isWarm ? "triangle" : "sawtooth";
        osc.frequency.setValueAtTime(isWarm ? 216 : 110, now);
        osc.frequency.exponentialRampToValueAtTime(isWarm ? 432 : 65, now + duration);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.15, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connections
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        whiteNoise.start(now);
        osc.start(now);

        whiteNoise.stop(now + duration);
        osc.stop(now + duration);
    }

    // Play subtle radar ping
    playRadarPing() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }
}

export const evpSound = new EvpSynthesizer();
