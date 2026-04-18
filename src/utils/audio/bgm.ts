import { AudioContextManager } from './index';

export class BGMEngine {
  private static nextNoteTime = 0;
  private static beatIndex = 0;
  private static isPlaying = false;
  private static timerId: number | null = null;
  private static readonly tempo = 100;
  private static readonly lookahead = 25.0;
  private static readonly scheduleAheadTime = 0.2;

  // Song Constants
  private static readonly BARS = 76; // Approx 3 minutes at 100 BPM
  private static readonly BEATS_PER_BAR = 8; // 1/8 note resolution

  // Frequency Table
  private static FREQS: Record<string, number> = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50
  };

  // Chord Progressions (IV - V - iii - vi)
  private static chords = [
    ['F3', 'A3', 'C4', 'E4'], // Fmaj7
    ['G3', 'B3', 'D4', 'G4'], // G7
    ['E3', 'G3', 'B3', 'D4'], // Em7
    ['A3', 'C4', 'E4', 'G4'], // Am7
  ];

  // Helper to generate a repeated pattern with variation
  private static getMelody() {
    const m: (string | null)[] = [];
    const mainTheme = ['C5', null, 'D5', null, 'E5', null, 'G4', null, 'D5', null, 'C5', null, 'B4', null, 'G4', null];
    const chorusTheme = ['A5', null, 'G5', null, 'E5', null, 'D5', null, 'E5', null, 'G5', null, 'C5', null, null, null];
    
    for (let bar = 0; bar < this.BARS; bar++) {
      if (bar < 16 || (bar >= 32 && bar < 48)) {
        // Verse style
        m.push(...mainTheme);
      } else if (bar >= 16 && bar < 32) {
        // Variation
        m.push(...mainTheme.slice(0, 8), 'C5', 'D5', 'E5', 'G5', 'A5', null, null, null);
      } else if (bar >= 48 && bar < 64) {
        // Chorus style
        m.push(...chorusTheme);
      } else {
        // Outro (Lonely)
        m.push('C5', null, null, null, 'G4', null, null, null, null, null, null, null, null, null, null, null);
      }
    }
    return m;
  }

  private static melodySequence = this.getMelody();

  // Instruments
  private static playPiano(freq: number, time: number, dur: number, volume: number) {
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    // Emotional detune for nostalgic feel
    osc.detune.setValueAtTime(Math.random() * 4 - 2, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
  }

  private static playKick(time: number, volume: number) {
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private static playSnare(time: number, volume: number) {
    const ctx = AudioContextManager.getCtx();
    const bufSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(time);
  }

  private static playString(freq: number, time: number, dur: number, volume: number) {
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + dur * 0.5);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.4); // Slow attack for violin feel
    gain.gain.linearRampToValueAtTime(volume * 0.8, time + dur * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
  }

  private static playGlass(freq: number, time: number, dur: number, volume: number) {
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 2, time); // FM style octave shift

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private static scheduler() {
    const ctx = AudioContextManager.getCtx();
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      if (AudioContextManager.isMuted) {
        this.nextNoteTime += (60.0 / this.tempo) / 2;
        this.beatIndex++;
        continue;
      }

      const secondsPerBeat = 60.0 / this.tempo;
      const beatDur = secondsPerBeat / 2; // 1/8 note
      const currentBar = Math.floor(this.beatIndex / this.BEATS_PER_BAR);
      const songBar = currentBar % this.BARS;

      // Layer Management based on song progress
      const hasPiano = true;
      const hasDrums = songBar >= 16 && songBar < 48;
      const hasStrings = songBar >= 48 && songBar < 68;
      const hasGlass = songBar >= 32 && songBar < 68;
      const isOutro = songBar >= 68;

      // Piano Chords (Every bar)
      if (this.beatIndex % this.BEATS_PER_BAR === 0) {
        const chord = this.chords[currentBar % this.chords.length];
        const vol = isOutro ? 0.03 : 0.06;
        chord.forEach(note => this.playPiano(this.FREQS[note], this.nextNoteTime, secondsPerBeat * 4, vol));
      }

      // Melody
      const melodyNote = this.melodySequence[this.beatIndex % this.melodySequence.length];
      if (melodyNote) {
        this.playPiano(this.FREQS[melodyNote], this.nextNoteTime, beatDur * 2, isOutro ? 0.05 : 0.1);
        if (hasGlass && Math.random() > 0.5) {
          this.playGlass(this.FREQS[melodyNote], this.nextNoteTime, beatDur, 0.04);
        }
      }

      // Drums
      if (hasDrums) {
        const subBeat = this.beatIndex % this.BEATS_PER_BAR;
        if (subBeat === 0 || subBeat === 4) this.playKick(this.nextNoteTime, 0.15);
        if (subBeat === 2 || subBeat === 6) this.playSnare(this.nextNoteTime, 0.05);
        this.playSnare(this.nextNoteTime, 0.02); // Hi-hat simulation with soft snare
      }

      // Strings (Long notes)
      if (hasStrings && this.beatIndex % 16 === 0) {
        const root = this.chords[currentBar % this.chords.length][0];
        this.playString(this.FREQS[root] * 2, this.nextNoteTime, secondsPerBeat * 8, 0.04);
      }

      this.nextNoteTime += beatDur;
      this.beatIndex++;
    }
    this.timerId = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  public static start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.beatIndex = 0;
    this.nextNoteTime = AudioContextManager.getCtx().currentTime + 0.1;
    this.scheduler();
  }

  public static stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
