import { getSignSpacing, getTaperLength, getBufferZone, getConesSpacing } from './rules/vicroadsRules';

const speed = 60;
const [signA, signB, signC] = getSignSpacing(speed);
const taper = getTaperLength(speed);
const buffer = getBufferZone(speed);
const coneSpacing = getConesSpacing(speed);
