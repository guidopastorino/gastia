export type Point = { x: number; y: number };

/**
 * Smooth path through the points using monotone cubic interpolation
 * (Fritsch–Carlson): unlike Catmull-Rom it never overshoots, so the curve
 * doesn't invent peaks or dips between data points.
 */
export function monotonePath(pts: Point[]) {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0].x},${pts[0].y}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    slope[i] = (pts[i + 1].y - pts[i].y) / (dx[i] || 1);
  }

  const t: number[] = new Array(n);
  t[0] = slope[0];
  t[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / slope[i];
    const b = t[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const s = 3 / Math.sqrt(h);
      t[i] = s * a * slope[i];
      t[i + 1] = s * b * slope[i];
    }
  }

  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const third = dx[i] / 3;
    d += ` C${pts[i].x + third},${pts[i].y + t[i] * third} ${pts[i + 1].x - third},${pts[i + 1].y - t[i + 1] * third} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}
