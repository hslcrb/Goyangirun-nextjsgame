export class AudioContextManager {
  private static ctx: AudioContext | null = null;
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

  static toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}
