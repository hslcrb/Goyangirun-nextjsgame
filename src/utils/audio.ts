import { AudioContextManager } from './audio/index';
import { playJumpSound } from './audio/jump';
import { playDamageSound } from './audio/damage';
import { playHealSound } from './audio/heal';
import { BGMEngine } from './audio/bgm';

export const audioManager = {
  init: () => AudioContextManager.getCtx(),
  toggleMute: () => AudioContextManager.toggleMute(),
  playJump: playJumpSound,
  playDamage: playDamageSound,
  playHeal: playHealSound,
  startBgm: () => BGMEngine.start(),
  stopBgm: () => BGMEngine.stop(),
};
