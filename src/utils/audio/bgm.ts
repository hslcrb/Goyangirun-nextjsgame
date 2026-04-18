import { AudioContextManager } from './index';

export class BGMEngine {
  private static nextNoteTime = 0;
  private static beatIndex = 0;
  private static isPlaying = false;
  private static timerId: number | null = null;
  private static readonly tempo = 100; // Mellow spring tempo
  private static readonly lookahead = 25.0; 
  private static readonly scheduleAheadTime = 0.15; 

  // Frequencies
  private static F3 = 174.61;
  private static G3 = 196.00;
  private static A3 = 220.00;
  private static B3 = 246.94;
  private static C4 = 261.63;
  private static D4 = 293.66;
  private static E4 = 329.63;
  private static F4 = 349.23;
  private static G4 = 392.00;
  private static A4 = 440.00;
  private static B4 = 493.88;
  private static C5 = 523.25;
  private static D5 = 587.33;
  private static E5 = 659.25;

  // IV - V - iii - vi (Royal Road Progression)
  private static chords = [
    [this.F3, this.A3, this.C4, this.E4], // Fmaj7
    [this.G3, this.B3, this.D4, this.G4], // G7
    [this.E3(), this.G3, this.B3, this.D4], // Em7
    [this.A3, this.C4, this.E4, this.G4], // Am7
  ];

  private static E3() { return 164.81; }

  // Melody sequence (approx 64 beats = 16 bars)
  private static melody = [
    // Bar 8 (Am7)
    this.E5, null, null, null, null, null, null, null,
    // Bar 9 (Fmaj7) - Verse 2
    this.C5, null, this.C5, null, this.D5, null, this.E5, null,
    // Bar 10 (G7)
    this.B4, null, this.B4, null, this.C5, null, this.D5, null,
    // Bar 11 (Em7)
    this.G4, null, this.G4, null, this.A4, null, this.B4, null,
    // Bar 12 (Am7)
    this.C5, null, null, null, this.C5, this.D5, this.E5, this.G4,
    // Bar 13 (Fmaj7) - Pre-Chorus
    this.A4, null, this.C5, null, this.E5, null, this.D5, null,
    // Bar 14 (G7)
    this.B4, null, this.D5, null, this.G5(), null, this.F4, null,
    // Bar 15 (Em7)
    this.E5, null, this.D5, null, this.C5, null, this.B4, null,
    // Bar 16 (Am7)
    this.A4, null, this.B4, this.C5, this.D5, this.E5, this.G5(), null,
    // Bar 17-24 Repeat section with slight change in end
    this.C5, null, this.D5, null, this.E5, null, this.G4, null,
    this.D5, null, this.C5, null, this.B4, null, this.G4, null,
    this.B4, null, this.C5, null, this.D5, null, this.E5, null,
    this.A4, null, null, null, null, null, null, null,
    this.C5, null, this.D5, this.E5, null, this.G5(), null, this.E5,
    this.D5, null, this.C5, null, this.B4, null, this.C5, this.D5,
    this.G4, null, this.A4, this.B4, null, this.C5, null, this.D5,
    this.E5, null, null, null, null, null, this.G5(), this.A5(),
    // Bar 25-32 Chorus style (Higher energy)
    this.A5(), null, this.G5(), null, this.E5, null, this.D5, null,
    this.E5, null, this.G5(), null, this.C5, null, null, null,
    this.D5, null, this.E5, null, this.G5(), null, this.A5(), null,
    this.G5(), null, null, null, null, null, null, null,
    this.A5(), null, this.C6(), null, this.B5(), null, this.G5(), null,
    this.E5, null, this.G5(), null, this.D5, null, null, null,
    this.C5, null, this.D5, null, this.E5, null, this.G5(), null,
    this.C5, null, null, null, null, null, null, null,
  ];

  private static G5() { return 783.99; }
  private static A5() { return 880.00; }
  private static B5() { return 987.77; }
  private static C6() { return 1046.50; }

  private static scheduleChord(freqs: number[], time: number, dur: number) {
    if (AudioContextManager.isMuted) return;
    const ctx = AudioContextManager.getCtx();
    const pianoGain = ctx.createGain();
    pianoGain.gain.setValueAtTime(0, time);
    pianoGain.gain.linearRampToValueAtTime(0.08, time + 0.05); // Soft attack
    pianoGain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.9);

    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle'; // Soft sound
      osc.frequency.setValueAtTime(f, time);
      osc.connect(pianoGain);
      osc.start(time);
      osc.stop(time + dur);
    });

    pianoGain.connect(ctx.destination);
  }

  private static scheduleMelody(freq: number | null, time: number, dur: number) {
    if (freq === null || AudioContextManager.isMuted) return;
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + dur);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + dur);
  }

  private static scheduler() {
    const ctx = AudioContextManager.getCtx();
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      const secondsPerBeat = 60.0 / this.tempo;
      const beatDuration = secondsPerBeat / 2; // 1/8 notes

      // Schedule chord every 4 beats (1 bar)
      if (this.beatIndex % 8 === 0) {
        const chordIndex = (this.beatIndex / 8) % this.chords.length;
        this.scheduleChord(this.chords[chordIndex], this.nextNoteTime, secondsPerBeat * 4);
      }

      // Schedule melody every half beat (1/8 note)
      const melodyIndex = this.beatIndex % this.melody.length;
      this.scheduleMelody(this.melody[melodyIndex], this.nextNoteTime, beatDuration);

      this.nextNoteTime += beatDuration;
      this.beatIndex++;
    }
    this.timerId = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  public static start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const ctx = AudioContextManager.getCtx();
    this.nextNoteTime = ctx.currentTime + 0.1;
    this.beatIndex = 0;
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
