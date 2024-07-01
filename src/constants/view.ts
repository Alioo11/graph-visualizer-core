export const INFINITE_CANVAS_DEFAULT_RULER_WIDTH = 30;
export const INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE = 10;
export const INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY = true;
export const INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY = true;


export const INFINITE_CANVAS_SCALE_BOUNDARY: [number, number] = [0.5, 150];

/**
 * top left boundary: [x1,y1]
 * bottom right boundary: [x2,y2]
 */
export const INFINITE_CANVAS_TRANSITION_BOUNDARY: [[number, number], [number, number]] = [
  [-4000, -4000],
  [4000, 4000],
];

export const infiniteCanvasScaleMapToRulerGap = (scale: number) => {
  if (scale > 120) return 0.5;
  else if (scale <= 120 && scale > 30) return 1;
  else if (scale <= 30 && scale > 5) return 5;
  else if (scale <= 5 && scale > 2) return 10;
  else if (scale <= 2) return 50;
  throw new Error(`unsupported scale value: ${scale}`);
};
