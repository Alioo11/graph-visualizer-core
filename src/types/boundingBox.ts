import type { coordinate } from "./coordinate";
import type ILine from "./line";

export interface IBoundingBox {
  lineIntersections: (line: ILine) => Array<coordinate>;
  width: number;
  height: number;
  chord: number;
}
