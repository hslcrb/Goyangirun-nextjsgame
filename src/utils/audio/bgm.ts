import { AudioContextManager } from './index';

export class BGMEngine {
  private static nextNoteTime = 0;
  private static beatIndex = 0;
  private static isPlaying = false;
  private static timerId: number | null = null;
  private static readonly tempo = 140; 
  private static readonly lookahead = 25.0; 
  private static readonly scheduleAheadTime = 0.1; 

  private static notes = [
    // Simple happy bouncy baseline
    { note: 261.63, dur: 0.5 }, // C4
    { note: 329.63, dur: 0.5 }, // E4
    { note: 392.00, dur: 0.5 }, // G4
    { note: 329.63, dur: 0.5 }, // E4
    { note: 349.23, dur: 0.5 }, // F4
    { note: 440.00, dur: 0.5 }, // A4
    { note: 523.25, dur: 1.0 }, // C5
  ];

  private static scheduleNote(noteFreq: number, time: number, dur: number) {
    if (AudioContextManager.isMuted) return;
    try {
      const ctx = AudioContextManager.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = noteFreq;
      
      const secondsPerBeat = 60.0 / this.tempo;
      const duration = dur * secondsPerBeat;

      // Make it slightly staccato for bouncy feel
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.error(e);
    }
  }

  private static scheduler() {
    const ctx = AudioContextManager.getCtx();
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      const currentNote = this.notes[this.beatIndex % this.notes.length];
      const secondsPerBeat = 60.0 / this.tempo;
      
      this.scheduleNote(currentNote.note, this.nextNoteTime, currentNote.dur);
      
      this.nextNoteTime += currentNote.dur * secondsPerBeat;
      this.beatIndex++;
    }
    this.timerId = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  public static start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const ctx = AudioContextManager.getCtx();
    this.nextNoteTime = ctx.currentTime + 0.1;
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
