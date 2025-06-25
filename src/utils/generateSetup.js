import {
  getSignSpacing,
  getTaperLength,
  getBufferZone,
  getConesSpacing
} from '../rules/vicroadsRules';

export function generateTrafficSetup(speed) {
  const [signA, signB, signC] = getSignSpacing(speed);
  const taper = getTaperLength(speed);
  const buffer = getBufferZone(speed);
  const coneSpacing = getConesSpacing(speed);

  return {
    signs: { signA, signB, signC },
    taper,
    buffer,
    coneSpacing
  };
}

