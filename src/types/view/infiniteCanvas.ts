import type * as D3 from "d3";
import { viewEventMap } from ".";
export type infiniteCanvasZoomType = D3.D3ZoomEvent<SVGElement, unknown>["transform"];

export interface infiniteCanvasEventMap extends viewEventMap {
  "zoom": infiniteCanvasZoomType;
}
