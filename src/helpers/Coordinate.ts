import type { coordinate } from "@_types/coordinate";

class CoordinateHelper {
  static getAngleBetweenPoints(coordinate1: coordinate, coordinate2: coordinate): number {
    const { x: x1, y: y1 } = coordinate1;
    const { x: x2, y: y2 } = coordinate2;

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    const angle = Math.atan2(deltaY, deltaX);

    return angle;
  }

  static getDistanceBetweenTwoPoints(coordinate1: coordinate, coordinate2: coordinate): number {
    const { x: x1, y: y1 } = coordinate1;
    const { x: x2, y: y2 } = coordinate2;
    const DX = x2 - x1;
    const DY = y2 - y1;

    return Math.sqrt(DX ** 2 + DY ** 2);
  }

  static getNextPointByLengthAndAngle(coordinate: coordinate, length:number, angle: number): coordinate {
    return { x: coordinate.x + Math.cos(angle) * length, y: coordinate.y + Math.sin(angle) * length };
  }
}

export default CoordinateHelper;