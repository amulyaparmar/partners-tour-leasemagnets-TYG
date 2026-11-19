export interface InkPoint {
  x: number;
  y: number;
  p: number;
  t: number;
}
export interface OutlineOptions {
  /** Diameter of the stroke at half pressure, in pad units. */
  size: number;
  /** How much pressure changes the width, from 0 to 1. */
  thinning?: number;
  /** How far each point trails the pointer, from 0 to 1. Higher is smoother but lags more. */
  streamline?: number;
  /** Derive pressure from speed when the device reports none: fast is thin, slow is full. */
  simulatePressure?: boolean;
  /** Length over which the start and the end taper, in pad units. */
  taperStart?: number;
  taperEnd?: number;
  /** False while the stroke is still being drawn, so the end does not taper yet. */
  last?: boolean;
}
type Vec = [number, number];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Vec, n: number): Vec => [a[0] * n, a[1] * n];
const lerp = (a: Vec, b: Vec, t: number): Vec => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const dist = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1]);
  return l ? [a[0] / l, a[1] / l] : [0, 0];
};
const perp = (a: Vec): Vec => [a[1], -a[0]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const rotAround = (p: Vec, c: Vec, r: number): Vec => {
  const s = Math.sin(r),
    co = Math.cos(r),
    px = p[0] - c[0],
    py = p[1] - c[1];
  return [px * co - py * s + c[0], px * s + py * co + c[1]];
};
const easeOut = (t: number) => t * (2 - t);

/**
 * Turns sampled points into the outline of a variable width stroke, in the spirit of perfect-freehand. Points are streamlined
 * toward the pointer, width follows pen pressure or, for a mouse or finger, speed, the ends taper, sharp turns get round joins,
 * and both ends get round caps. Returns the outline polygon; pass it to `outlineToPath` for SVG.
 */
export function getStrokeOutline(
  input: InkPoint[],
  options: OutlineOptions,
): Vec[] {
  const {
    size,
    thinning = 0.62,
    streamline = 0.42,
    simulatePressure = true,
    taperStart = 0,
    taperEnd = 0,
    last = true,
  } = options;
  if (!input.length) return [];
  const usePen = !simulatePressure && input.some((point) => point.p > 0);

  // Streamline: each point eases toward the raw input, which removes jitter without a smoothing pass.
  const pts: { at: Vec; pressure: number; length: number; vector: Vec }[] = [];
  let prev: Vec = [input[0].x, input[0].y],
    length = 0;
  pts.push({
    at: prev,
    pressure: usePen ? input[0].p : 0.5,
    length: 0,
    vector: [1, 0],
  });
  for (let i = 1; i < input.length; i++) {
    const raw: Vec = [input[i].x, input[i].y];
    const at =
      i === input.length - 1 && last ? raw : lerp(prev, raw, 1 - streamline);
    const d = dist(at, prev);
    if (d < 0.4) continue;
    length += d;
    pts.push({
      at,
      pressure: usePen ? input[i].p : 0.5,
      length,
      vector: norm(sub(prev, at)),
    });
    prev = at;
  }
  if (pts.length > 1) pts[0].vector = pts[1].vector;
  const total = length;

  // A dot: a round mark sized by the first pressure.
  if (pts.length === 1) {
    const r = Math.max(
      0.6,
      size * (0.5 - thinning * (0.5 - pts[0].pressure)) * 0.9,
    );
    return Array.from({ length: 18 }, (_, i) =>
      add(
        pts[0].at,
        mul(
          [Math.cos((i / 18) * Math.PI * 2), Math.sin((i / 18) * Math.PI * 2)],
          r,
        ),
      ),
    );
  }

  const left: Vec[] = [],
    right: Vec[] = [];
  let pressure = pts[0].pressure,
    prevVector = pts[0].vector;
  const radii: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const point = pts[i];
    if (!usePen) {
      // Speed thins the line: a long step between samples reads as a fast stroke.
      const step = i === 0 ? 0 : dist(point.at, pts[i - 1].at);
      const speed = Math.min(1, step / size);
      const target = Math.min(1, 1 - speed);
      pressure = Math.min(1, pressure + (target - pressure) * speed * 0.3);
    } else {
      pressure = point.pressure;
    }
    let radius = Math.max(0.25, size * (0.5 - thinning * (0.5 - pressure)));
    const ts = taperStart ? easeOut(Math.min(1, point.length / taperStart)) : 1;
    const te =
      taperEnd && last
        ? easeOut(Math.min(1, (total - point.length) / taperEnd))
        : 1;
    radius = Math.max(0.12 * size, radius * Math.min(ts, te));
    radii.push(radius);

    const next = pts[i + 1]?.vector ?? point.vector;
    const offset = mul(perp(lerp(next, point.vector, 0.5)), radius);
    // A sharp turn: sweep round the corner so the outline does not pinch.
    if (i > 0 && i < pts.length - 1 && dot(point.vector, next) < -0.2) {
      const corner = mul(perp(prevVector), radius);
      for (let t = 0; t <= 1; t += 1 / 12) {
        left.push(rotAround(sub(point.at, corner), point.at, Math.PI * t));
        right.push(rotAround(add(point.at, corner), point.at, -Math.PI * t));
      }
    } else {
      left.push(sub(point.at, offset));
      right.push(add(point.at, offset));
    }
    prevVector = point.vector;
  }

  // Round caps: half circles swept around the first and last points, on the side facing away from the stroke.
  const cap = (center: Vec, from: Vec, to: Vec, away: Vec) => {
    const out: Vec[] = [];
    const r = dist(center, from),
      start = Math.atan2(from[1] - center[1], from[0] - center[0]);
    const mid = start + Math.PI / 2;
    const sign = dot([Math.cos(mid), Math.sin(mid)], away) >= 0 ? 1 : -1;
    for (let k = 1; k < 12; k++) {
      const a = start + (sign * Math.PI * k) / 12;
      out.push([center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r]);
    }
    out.push(to);
    return out;
  };
  const first = pts[0],
    end = pts[pts.length - 1];
  const endCap = cap(
    end.at,
    left[left.length - 1],
    right[right.length - 1],
    mul(end.vector, -1),
  );
  const startCap = cap(first.at, right[0], left[0], first.vector);
  return [...left, ...endCap, ...right.reverse(), ...startCap];
}

const round = (value: number) => Math.round(value * 100) / 100;
/** Draws an outline as one smooth closed path, with quadratic curves through the midpoints of its edges. */
export function outlineToPath(points: Vec[]) {
  if (points.length < 3) return "";
  let d = `M${round(points[0][0])} ${round(points[0][1])} Q`;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i],
      [x1, y1] = points[(i + 1) % points.length];
    d += `${round(x0)} ${round(y0)} ${round((x0 + x1) / 2)} ${round((y0 + y1) / 2)} `;
  }
  return `${d}Z`;
}
