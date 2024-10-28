import type { coordinate } from "@_types/coordinate";
import type ILine from "@_types/line";

class Line implements ILine {
  from: coordinate;
  to: coordinate;

  constructor(from: coordinate, to: coordinate) {
    this.from = from;
    this.to = to;
  }

  get center() {
    return {
      x: (this.from.x + this.to.x) / 2,
      y: (this.from.y + this.to.y) / 2,
    };
  }

  rotate(angle: number): this {
    const center = this.center;

    const rotatePoint = (point: coordinate): coordinate => {
      const cosTheta = Math.cos(angle);
      const sinTheta = Math.sin(angle);

      return {
        x: cosTheta * (point.x - center.x) - sinTheta * (point.y - center.y) + center.x,
        y: sinTheta * (point.x - center.x) + cosTheta * (point.y - center.y) + center.y,
      };
    };

    this.from = rotatePoint(this.from);
    this.to = rotatePoint(this.to);
    return this;
  }

  grow(factor: number): this {
    const center = this.center;

    const scalePoint = (point: coordinate): coordinate => {
      return {
        x: center.x + (point.x - center.x) * factor,
        y: center.y + (point.y - center.y) * factor,
      };
    };

    this.from = scalePoint(this.from);
    this.to = scalePoint(this.to);
    return this;
  }

  distanceFromPoint = (point: coordinate): number => {
    const { x: x1, y: y1 } = this.from;
    const { x: x2, y: y2 } = this.to;
    const { x: px, y: py } = point;

    // Calculate the squared length of the line segment
    const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

    // If the segment is actually a single point, return the distance to it
    if (lineLengthSquared === 0) {
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }

    // Calculate the projection of the point onto the line, clamped to [0,1] to stay within the segment
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t)); // Clamp t to the range [0, 1]

    // Find the closest point on the line segment to the point
    const closestPoint: coordinate = {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1),
    };

    // Calculate the distance from the point to this closest point
    return Math.sqrt((px - closestPoint.x) ** 2 + (py - closestPoint.y) ** 2);
  };

  intersectionCoordinate: ILine["intersectionCoordinate"] = (line: Line) => {
    const { from: a, to: b } = this;
    const { from: c, to: d } = line;

    // Line 1 represented as a1x + b1y = c1
    const a1 = b.y - a.y;
    const b1 = a.x - b.x;
    const c1 = a1 * a.x + b1 * a.y;

    // Line 2 represented as a2x + b2y = c2
    const a2 = d.y - c.y;
    const b2 = c.x - d.x;
    const c2 = a2 * c.x + b2 * c.y;

    // Determinant to check for parallel lines
    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
      // Lines are parallel, no intersection
      return null;
    } else {
      // Calculate the intersection point
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;

      // Check if the intersection point is within the bounds of both line segments
      if (
        Math.min(a.x, b.x) <= x &&
        x <= Math.max(a.x, b.x) &&
        Math.min(a.y, b.y) <= y &&
        y <= Math.max(a.y, b.y) &&
        Math.min(c.x, d.x) <= x &&
        x <= Math.max(c.x, d.x) &&
        Math.min(c.y, d.y) <= y &&
        y <= Math.max(c.y, d.y)
      ) {
        return { x, y };
      } else {
        // Intersection point is not within the segment bounds
        return null;
      }
    }
  };
}

export default Line;
