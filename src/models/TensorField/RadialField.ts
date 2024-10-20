import type { coordinate } from "@_types/coordinate";
import type { IRadialField } from "@_types/tensorField";
import CoordinateHelper from "@helpers/Coordinate";

class RadialField implements IRadialField {
  center: coordinate;
  radius: number = 200;

  constructor(x: number, y: number) {
    this.center = { x, y };
  }

  get: IRadialField["get"] = (coordinate) => {
    const angle = CoordinateHelper.getAngleBetweenPoints(this.center, coordinate);
    const distance = CoordinateHelper.getDistanceBetweenTwoPoints(this.center, coordinate);

    if (distance > this.radius) return { angle: 0, intensity: 0 };

    return { angle: angle + Math.PI /2, intensity: 1 };
  };
}

export default RadialField;
