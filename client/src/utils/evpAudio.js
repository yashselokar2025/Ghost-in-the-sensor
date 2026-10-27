// Native Web Audio API Ghost Hunter Sound Engine
// Realistic K-II EMF meter clicking, radio static sweeps, eerie low drones, and optional jumpscare stingers!

class EvpSynthesizer {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Toggle subtle spooky ambient drone (hum of an old transformer + binaural theta wave)
    toggleAmbient(enable) {
        this.init();
        const now = this.ctx.currentTime;

        if (enable && !this.isAmbientPlaying) {
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, now);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.08, now + 2);
            this.ambientGain.connect(this.masterGain);

            this.droneOsc1 = this.ctx.createOscillator();
            this.droneOsc1.type = "sine";
            this.droneOsc1.frequency.setValueAtTime(55, now); // Low A

            this.droneOsc2 = this.ctx.createOscillator();
            this.droneOsc2.type = "triangle";
            this.droneOsc2.frequency.setValueAtTime(58.5, now); // 3.5Hz binaural beat for paranormal tension

            this.droneOsc1.connect(this.ambientGain);
            this.droneOsc2.connect(this.ambientGain);
            this.droneOsc1.start(now);
            this.droneOsc2.start(now);
            this.isAmbientPlaying = true;
        } else if (!enable && this.isAmbientPlaying) {
            if (this.ambientGain) {
                this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
                setTimeout(() => {
                    if (this.droneOsc1) { this.droneOsc1.stop(); this.droneOsc1.disconnect(); }
                    if (this.droneOsc2) { this.droneOsc2.stop(); this.droneOsc2.disconnect(); }
                    this.isAmbientPlaying = false;
                }, 850);
            }
        }
    }

    // Play iconic K-II EMF Geiger/Ticking Click
    playEmfClick(intensity = 1) {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140 + Math.random() * 80, now);

        const volume = Math.min(0.25, 0.05 * intensity);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Play EVP Spirit Box Sweep (radio bursts and whispered formants)
    playSpiritBurst(isWarm = false) {
        this.init();
        const now = this.ctx.currentTime;
        const duration = 2.4;

        // 1. Noise Generator
        const bufferSize = this.ctx.sampleRate * duration;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (1 - (i / bufferSize) * 0.4);
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = isWarm ? "lowpass" : "bandpass";
        filter.frequency.setValueAtTime(isWarm ? 432 : 1400, now);
        filter.frequency.exponentialRampToValueAtTime(isWarm ? 528 : 180, now + duration);
        filter.Q.setValueAtTime(isWarm ? 3 : 9, now);

        // 2. Modulated ghostly formant tone
        const osc = this.ctx.createOscillator();
        osc.type = isWarm ? "triangle" : "sawtooth";
        osc.frequency.setValueAtTime(isWarm ? 216 : 130, now);
        osc.frequency.exponentialRampToValueAtTime(isWarm ? 432 : 55, now + duration);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.18, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.22, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

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

    // Sudden Glitch / Jumpscare Audio Stinger
    playJumpscareStinger() {
        this.init();
        const now = this.ctx.currentTime;
        const duration = 1.2;

        // High frequency screech + sub-bass drop shockwave
        const screech = this.ctx.createOscillator();
        screech.type = "sawtooth";
        screech.frequency.setValueAtTime(1800, now);
        screech.frequency.exponentialRampToValueAtTime(110, now + duration);

        const subBoom = this.ctx.createOscillator();
        subBoom.type = "sine";
        subBoom.frequency.setValueAtTime(95, now);
        subBoom.frequency.exponentialRampToValueAtTime(30, now + duration);

        const screechGain = this.ctx.createGain();
        screechGain.gain.setValueAtTime(0.35, now);
        screechGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const boomGain = this.ctx.createGain();
        boomGain.gain.setValueAtTime(0.5, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        screech.connect(screechGain);
        screechGain.connect(this.masterGain);

        subBoom.connect(boomGain);
        boomGain.connect(this.masterGain);

        screech.start(now);
        subBoom.start(now);

        screech.stop(now + duration);
        subBoom.stop(now + duration);
    }

    // Radar Ping
    playRadarPing() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(460, now + 0.25);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }
}

export const evpSound = new EvpSynthesizer();
