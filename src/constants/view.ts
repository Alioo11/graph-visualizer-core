import { infiniteCanvasZoomType } from "@_types/view/infiniteCanvas";
import { grey } from "@mui/material/colors";

export const INFINITE_CANVAS_DEFAULT_RULER_WIDTH = 35;
export const INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE = 11;
export const INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY = true;
export const INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY = true;
export const INFINITE_CANVAS_DEFAULT_GRID_VISIBILITY = true;


export const INFINITE_CANVAS_CONTENT_LAYER_Z_INDEX = 1;
export const INFINITE_CANVAS_RULER_LAYER_Z_INDEX = 3;
export const INFINITE_CANVAS_GRID_LAYER_Z_INDEX = 2;
export const INFINITE_CANVAS_TOOLTIP = 4;

export const INFINITE_CANVAS_PRIMARY_AXIS_STROKE =  grey["500"];
export const INFINITE_CANVAS_SECONDARY_AXIS_STROKE =  grey["200"];


export const INFINITE_CANVAS_SCALE_BOUNDARY: [number, number] = [0.1, 150];

/**
 * top left boundary: [x1,y1]
 * bottom right boundary: [x2,y2]
 */
export const INFINITE_CANVAS_TRANSITION_BOUNDARY: [[number, number], [number, number]] = [
  [-20000, -20000],
  [20000, 20000],
];

export const DEFAULT_ZOOM = { k: 1, x: 0, y: 0 } as infiniteCanvasZoomType;

export const infiniteCanvasScaleMapToRulerGap = (scale: number) => {
  if (scale > 120) return 0.5;
  else if (scale <= 120 && scale > 30) return 1;
  else if (scale <= 30 && scale > 5) return 10;
  else if (scale <= 5 && scale > 2) return 50;
  else if (scale <= 2 && scale > .5) return 100;
  else if (scale <= .5 && scale > .1) return 300;
  else if (scale <= .1) return 600;
  throw new Error(`unsupported scale value: ${scale}`);
};
