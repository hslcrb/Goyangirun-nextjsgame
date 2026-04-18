import { AudioContextManager } from './index';

export function playJumpSound() {
  if (AudioContextManager.isMuted) return;
  try {
    const ctx = AudioContextManager.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(AudioContextManager.getMasterGain());

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.error('Jump audio error', e);
  }
}
