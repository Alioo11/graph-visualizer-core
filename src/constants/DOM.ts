export const DOCUMENT_ID_CONSTANTS = {
  VIEW: {
    ROOT: "view-root",
    INFINITE_CANVAS: {
      ROOT: "infinite-canvas-root",
      RULER:{
        ROOT:"infinite-canvas-ruler-root",
        VERTICAL:"infinite-canvas_vertical-ruler",
        HORIZONTAL:"infinite-canvas_horizontal-ruler",
        CAP:"infinite-canvas-ruler-cap"
      },
      GRID: {
        ROOT: "infinite-canvas-grid-root"
      },
      VERTICAL_TICK: "infinite-canvas-vertical-ruler",
      HORIZONTAL_RULER: "infinite-canvas-horizontal-ruler",
      VERTICAL_RULER:"infinite-canvas_vertical-ruler",
      RULER_CAP: "infinite-canvas-ruler-cap",
      GRID_CONTAINER: "infinite-canvas-grid-container",
    },
    PATH_FINDING: {
      TOOLTIP_CONTAINER: "tool-tip-container",
    },
  },
};

export const DOCUMENT_CLASS_CONSTANTS = {
  VIEW: {
    INFINITE_CANVAS:{
      RULER_HORIZONTAL_TICK:"infinite-canvas-ruler-horizontal-tick",
      RULER_VERTICAL_TICK:"infinite-canvas-ruler-vertical-tick",
      RULER_CAP:"infinite-canvas-ruler-cap",
      VERTICAL_GRID:'infinite-canvas-vertical-grid',
      HORIZONTAL_GRID:'infinite-canvas-horizontal-grid'
    },
    PATH_FINDING: {
      EDGE: "path-finding-graph-edge",
      VERTEX: "path-finding-graph-vertex",
    },
  },
};
