import { blue, blueGrey, grey, pink, red } from "@mui/material/colors";
import { IDijkstraVisualizationOptions } from "../../types/pathFindingGraph";

export const DEFAULT_VERTEX_RADIUS = 15;
export const DEFAULT_VERTEX_STROKE_WIDTH = 1;


export const ENTRY_COLOR = blue["700"];
export const BLANK_COLOR = grey["100"];
export const TARGET_COLOR_LIST = [red["400"], blue["600"], pink["100"], blueGrey["A400"]];

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
