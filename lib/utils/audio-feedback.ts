"use client";

// Web Audio API Synthesizer for Luxury Tactile Feedback and Atelier Soundscapes

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Solid Mechanical Click (inspired by Bentley / Rolls-Royce knurled switchgear)
 */
export function playMechanicalClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {}
}

/**
 * Heavy Luxury Car Door "Thud" (solid, deep acoustic seal)
 */
export function playDoorThud() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Low sub-bass thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(110, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.2);

    subGain.gain.setValueAtTime(0.4, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.23);

    // Mechanical latch click right before
    const latchOsc = ctx.createOscillator();
    const latchGain = ctx.createGain();
    latchOsc.type = "triangle";
    latchOsc.frequency.setValueAtTime(750, ctx.currentTime);
    latchOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.06);

    latchGain.gain.setValueAtTime(0.2, ctx.currentTime);
    latchGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    latchOsc.connect(latchGain);
    latchGain.connect(ctx.destination);
    latchOsc.start();
    latchOsc.stop(ctx.currentTime + 0.07);
  } catch (e) {}
}

/**
 * Golden Crystalline Chime for VIP Confirmations / Bids
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [880, 1318.5, 1760].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      }, i * 70);
    });
  } catch (e) {}
}

/**
 * Launch Control Acoustic Charge & Release
 */
export function playLaunchSpool(durationSec: number = 2.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};

    // Dual oscillator rev buildup
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + durationSec);

    osc1.frequency.setValueAtTime(80, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + durationSec);

    osc2.frequency.setValueAtTime(82, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(425, ctx.currentTime + durationSec);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + durationSec);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    return () => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch (e) {}
        }, 120);
      } catch (e) {}
    };
  } catch (e) {
    return () => {};
  }
}

/**
 * Ambient Showroom Soundtrack Synthesizer
 * Generates an ethereal, relaxing lounge pad in warm luxury chords (F Major 9 / C Major 7)
 */
class AmbientSoundscapePlayer {
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;

  start() {
    if (this.isPlaying) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2); // Soft background volume
      this.masterGain.connect(ctx.destination);

      // F Major 9 chord: F3, A3, C4, E4, G4
      const frequencies = [174.61, 220.0, 261.63, 329.63, 392.0];

      this.oscillators = frequencies.map((freq, idx) => {
        const osc = ctx.createOscillator();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle organic detune/drift
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((idx - 2) * 0.35, ctx.currentTime);
          osc.connect(gain);
          gain.connect(panner);
          panner.connect(this.masterGain!);
        } else {
          osc.connect(gain);
          gain.connect(this.masterGain!);
        }

        osc.start();
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {}
  }

  stop() {
    if (!this.isPlaying || !this.masterGain) return;
    try {
      const ctx = getAudioContext();
      if (ctx) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      }
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch (e) {}
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 1300);
    } catch (e) {
      this.isPlaying = false;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  get active() {
    return this.isPlaying;
  }
}

export const ambientSoundscape = new AmbientSoundscapePlayer();

/**
 * Key Fob Unlock Dual-Chirp (Rolls-Royce / Porsche bespoke remote chirp)
 */
export function playKeyUnlockChirp() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, ctx.currentTime + offset);
      osc.frequency.exponentialRampToValueAtTime(2450, ctx.currentTime + offset + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.055);
    });
  } catch (e) {}
}

/**
 * Key Fob Lock Solenoid Thud
 */
export function playKeyLockThud() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Heavy mechanical solenoid
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(140, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    sub.connect(gain);
    gain.connect(ctx.destination);
    sub.start();
    sub.stop(ctx.currentTime + 0.15);

    // Single chirp
    const chirp = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirp.type = "sine";
    chirp.frequency.setValueAtTime(2100, ctx.currentTime + 0.04);
    chirpGain.gain.setValueAtTime(0.1, ctx.currentTime + 0.04);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    chirp.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirp.start(ctx.currentTime + 0.04);
    chirp.stop(ctx.currentTime + 0.095);
  } catch (e) {}
}

/**
 * Engine Ignition Roar (Starter crank + Throaty exhaust roar + idle burble)
 */
export function playEngineIgnitionRoar() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Starter motor cranks (3 pulses)
    [0, 0.15, 0.3].forEach((t) => {
      const crank = ctx.createOscillator();
      const crankGain = ctx.createGain();
      crank.type = "square";
      crank.frequency.setValueAtTime(120, ctx.currentTime + t);
      crank.frequency.linearRampToValueAtTime(90, ctx.currentTime + t + 0.08);

      crankGain.gain.setValueAtTime(0.08, ctx.currentTime + t);
      crankGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.09);

      crank.connect(crankGain);
      crankGain.connect(ctx.destination);
      crank.start(ctx.currentTime + t);
      crank.stop(ctx.currentTime + t + 0.1);
    });

    // Ignition roar flare
    const roarStart = 0.45;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(150, ctx.currentTime + roarStart);
    filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + roarStart + 0.35);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + roarStart + 1.2);

    osc1.frequency.setValueAtTime(90, ctx.currentTime + roarStart);
    osc1.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + roarStart + 0.35);
    osc1.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + roarStart + 1.2);

    osc2.frequency.setValueAtTime(92, ctx.currentTime + roarStart);
    osc2.frequency.exponentialRampToValueAtTime(385, ctx.currentTime + roarStart + 0.35);
    osc2.frequency.exponentialRampToValueAtTime(112, ctx.currentTime + roarStart + 1.2);

    gain.gain.setValueAtTime(0.01, ctx.currentTime + roarStart);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + roarStart + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + roarStart + 1.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime + roarStart);
    osc2.start(ctx.currentTime + roarStart);
    osc1.stop(ctx.currentTime + roarStart + 1.45);
    osc2.stop(ctx.currentTime + roarStart + 1.45);
  } catch (e) {}
}

/**
 * Bespoke Velvet Presentation Box Opening Sound
 */
export function playBoxLidOpen() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Brass latch release click
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(950, ctx.currentTime);
    click.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.05);

    clickGain.gain.setValueAtTime(0.2, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start();
    click.stop(ctx.currentTime + 0.06);

    // Velvet hinge suction glide
    const glide = ctx.createOscillator();
    const glideGain = ctx.createGain();
    glide.type = "sine";
    glide.frequency.setValueAtTime(350, ctx.currentTime + 0.03);
    glide.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.35);

    glideGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.03);
    glideGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    glide.connect(glideGain);
    glideGain.connect(ctx.destination);
    glide.start(ctx.currentTime + 0.03);
    glide.stop(ctx.currentTime + 0.42);
  } catch (e) {}
}
