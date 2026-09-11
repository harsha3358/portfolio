export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  doClamp = true
) {
  const t = (value - inMin) / (inMax - inMin);
  const result = outMin + t * (outMax - outMin);
  return doClamp ? clamp(result, Math.min(outMin, outMax), Math.max(outMin, outMax)) : result;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function easeOutCubic(t: number) {
  const c = clamp(t);
  return 1 - Math.pow(1 - c, 3);
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
