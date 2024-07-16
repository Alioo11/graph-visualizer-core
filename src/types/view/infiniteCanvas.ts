import type * as D3 from "d3";
export type infiniteCanvasZoomType = D3.D3ZoomEvent<SVGElement, unknown>["transform"];

export interface IInfiniteCanvasEventsMap {
  "zoom": infiniteCanvasZoomType;
}
