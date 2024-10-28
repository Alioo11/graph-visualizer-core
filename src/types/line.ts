import type { Nullable } from "ts-wiz";
import type { coordinate } from "./coordinate";

interface ILine {
  from: coordinate;
  to: coordinate;
  center: coordinate;
  rotate(angle: number): this;
  grow(factor: number): this;
  intersectionCoordinate: (otherLine: ILine) => Nullable<coordinate>;
  distanceFromPoint: (point: coordinate) => number;
}

export default ILine;
