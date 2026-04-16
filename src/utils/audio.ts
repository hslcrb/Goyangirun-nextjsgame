// Simple Web Audio API Synthesizer

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillator: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private isPlayingBgm: boolean = false;
  private bgmTimeout: NodeJS.Timeout | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.bgmGain) this.bgmGain.gain.value = 0;
    } else {
      if (this.bgmGain) this.bgmGain.gain.value = 0.1;
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Play a simple sweep up for jump
  playJump() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Play a noisy/falling sound for damage
  playDamage() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Play a happy arpeggio for heal
  playHeal() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    
    // Quick arpeggio C5, E5, G5
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Simple sequencer for background music
  startBgm() {
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // A simple happy 8-bit melody (frequencies in Hz)
    // C4, E4, G4, A4, C5
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      
      if (!this.isMuted) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[noteIndex], this.ctx.currentTime);

        // Envelopes
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      }

      noteIndex = (noteIndex + 1) % notes.length;
      this.bgmTimeout = setTimeout(playNextNote, 200); // 150BPM (8th notes)
    };

    playNextNote();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioEngine();
