export function getSignSpacing(speed) {
  if (speed <= 40) return [30, 20, 10];
  if (speed <= 60) return [60, 40, 20];
  if (speed <= 80) return [100, 60, 40];
  return [150, 100, 60];
}

export function getTaperLength(speed) {
  return speed; // 1:1 taper
}

export function getBufferZone(speed) {
  return speed * 2; // Basic logic for now
}

export function getConesSpacing(speed) {
  if (speed <= 40) return 5;
  if (speed <= 60) return 10;
  if (speed <= 80) return 20;
  return 40;
}
