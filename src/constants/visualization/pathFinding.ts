import { IDijkstraVisualizationOptions } from "@_types/pathFindingGraph";
import { blue, green, grey, red } from "@mui/material/colors";

export const DEFAULT_VERTEX_RADIUS = 25;
export const DEFAULT_VERTEX_STROKE_WIDTH = 1;

export const ENTRY_COLOR = blue["A700"];
export const BLANK_COLOR = grey["100"];
export const TARGET_COLOR_LIST = [red["300"], blue["400"], green["500"]];

export const DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS: Required<IDijkstraVisualizationOptions> = {
  width: 40,
  height: 40,
  entry: [10, 10],
  targetPoints: [[20, 20]],
};

export const SELECTION_ATTRIBUTE_LIST: Array<[string, string]> = [
  ["stroke", blue["400"]],
  ["stroke-width", "4"],
];
