export type DragonPoint = {
  x: number;
  y: number;
};

export type DragonSegment = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const MAX_DRAGON_ORDER = 10;

export function generateDragonPoints(order: number): DragonPoint[] {
  if (!Number.isInteger(order) || order < 1 || order > MAX_DRAGON_ORDER) {
    throw new Error(`Dragon curve order must be an integer from 1 to ${MAX_DRAGON_ORDER}.`);
  }

  let turns: number[] = [];

  for (let index = 0; index < order; index += 1) {
    turns = [...turns, 1, ...turns.slice().reverse().map((turn) => -turn)];
  }

  const points: DragonPoint[] = [{ x: 0, y: 0 }];
  let direction = 0;

  for (const turn of turns) {
    const last = points[points.length - 1];
    points.push({
      x: last.x + Math.round(Math.cos(direction * (Math.PI / 2))),
      y: last.y + Math.round(Math.sin(direction * (Math.PI / 2))),
    });
    direction = (direction + turn + 4) % 4;
  }

  const last = points[points.length - 1];
  points.push({
    x: last.x + Math.round(Math.cos(direction * (Math.PI / 2))),
    y: last.y + Math.round(Math.sin(direction * (Math.PI / 2))),
  });

  return normalizePoints(points);
}

export function generateDragonSegments(order: number): DragonSegment[] {
  const points = generateDragonPoints(order);

  return points.slice(1).map((point, index) => {
    const previous = points[index];

    return {
      id: `dragon-segment-${index}`,
      x1: previous.x,
      y1: previous.y,
      x2: point.x,
      y2: point.y,
    };
  });
}

export function visibleSegmentCount(totalSegments: number, progress: number): number {
  return Math.ceil(Math.pow(2, visibleDragonOrder(totalSegments, progress)));
}

export function visibleDragonOrder(totalSegments: number, progress: number): number {
  const clampedProgress = clamp(progress, 0, 1);
  const maxOrder = Math.log2(totalSegments);
  const orderProgress = 1 + clampedProgress * (maxOrder - 1);

  return Math.min(maxOrder, Math.max(1, orderProgress));
}

function normalizePoints(points: DragonPoint[]): DragonPoint[] {
  const bounds = points.reduce(
    (current, point) => ({
      minX: Math.min(current.minX, point.x),
      maxX: Math.max(current.maxX, point.x),
      minY: Math.min(current.minY, point.y),
      maxY: Math.max(current.maxY, point.y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    }
  );

  const width = bounds.maxX - bounds.minX || 1;
  const height = bounds.maxY - bounds.minY || 1;
  const scale = 220 / Math.max(width, height);
  const centerX = bounds.minX + width / 2;
  const centerY = bounds.minY + height / 2;

  return points.map((point) => ({
    x: (point.x - centerX) * scale,
    y: (point.y - centerY) * scale,
  }));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
