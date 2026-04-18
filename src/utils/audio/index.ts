export class AudioContextManager {
  private static ctx: AudioContext | null = null;
  private static masterGainNode: GainNode | null = null;
  public static isMuted: boolean = false;

  static getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  static getMasterGain() {
    const ctx = this.getCtx();
    if (!this.masterGainNode) {
      this.masterGainNode = ctx.createGain();
      this.masterGainNode.connect(ctx.destination);
    }
    return this.masterGainNode;
  }

  static toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : 1, this.getCtx().currentTime);
    }
    return this.isMuted;
  }
}
