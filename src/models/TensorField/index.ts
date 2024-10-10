import type { ITensorField } from "@_types/tensorField";
import RadialField from "./RadialField";

class TensorField implements ITensorField {
  globalSift: ITensorField["globalSift"] = { angle: 0, intensity: 0 };

  private _radialFields: Array<RadialField> = [];

  addRadial(radialField: RadialField) {
    this._radialFields.push(radialField);
  }

  get: ITensorField["get"] = (coordinate) => {
    const radialValues = this._radialFields.map((radialField) => radialField.get(coordinate));

    const radialSum = radialValues.reduce(
      (acc, cur) => (acc = { intensity: acc.intensity + cur.intensity, angle: acc.angle + cur.angle * cur.intensity }),
      {
        angle: 0,
        intensity: 0,
      }
    );

    return Math.max(1, radialSum.intensity) * radialSum.angle;
  };
}

export default TensorField;
