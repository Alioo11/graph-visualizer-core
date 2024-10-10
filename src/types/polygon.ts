import { coordinate } from "./coordinate";

export interface IPolygon {
  isInside: (x: number, y: number) => boolean;
}

export type IPolygonGraphVertex = coordinate;

export interface IPolygonGraphEdge {}

export type PolygonAsArray = Array<[number, number]>;

export interface IPolygonEventMap {
  "vertex-move": coordinate;
}
