import type { coordinate } from "./coordinate";

/** a angle where `0` < `angle` < `π` */
type TensorValue = { angle: number; intensity: number };

interface Field {
    get: (coordinate: coordinate) => TensorValue;  
}

export interface ITensorField {
  globalSift: TensorValue;
  get: (coordinate: coordinate) => number;
}

export interface IRadialField  extends Field {
  center: coordinate;
  radius: number;
}

export interface ff {
}
