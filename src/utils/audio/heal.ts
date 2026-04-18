import { AudioContextManager } from './index';

export function playHealSound() {
  if (AudioContextManager.isMuted) return;
  try {
    const ctx = AudioContextManager.getCtx();
    const t = ctx.currentTime;
    
    // Create an arpeggio effect (like energy filling up fast)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 E5 G5 C6 E6 G6
    const noteDuration = 0.05;
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * noteDuration);
      
      // Fast attack and decay for each note
      gain.gain.setValueAtTime(0, t + idx * noteDuration);
      gain.gain.linearRampToValueAtTime(0.2, t + idx * noteDuration + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, t + (idx + 1) * noteDuration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(t + idx * noteDuration);
      osc.stop(t + (idx + 1) * noteDuration);
    });
    
    // Background shimmer (high pitched sine)
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(2000, t);
    shimmerOsc.frequency.linearRampToValueAtTime(3000, t + notes.length * noteDuration);
    
    shimmerGain.gain.setValueAtTime(0, t);
    shimmerGain.gain.linearRampToValueAtTime(0.05, t + 0.1);
    shimmerGain.gain.linearRampToValueAtTime(0, t + notes.length * noteDuration);
    
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(t);
    shimmerOsc.stop(t + notes.length * noteDuration);
    
  } catch (e) {
    console.error('Heal audio error', e);
  }
}
