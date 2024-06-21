import AdjacencyMatrix from ".";
import {
  DhouibAdjacencyMatrixRelation,
  IDhouibAdjacencyMatrixEventMap,
  IDhouibAdjacencyMatrixHeader,
  IDhouibAdjacencyMatrixRelation,
  IDhouibGraphEdge,
  IDhouibGraphVertex,
} from "../../../types/dhouib";
import type { Nullable } from "ts-wiz";

class DhouibAdjacencyMatrix extends AdjacencyMatrix<
  IDhouibGraphVertex,
  IDhouibGraphEdge,
  IDhouibAdjacencyMatrixHeader,
  IDhouibAdjacencyMatrixRelation
> {
  minimumValuesOfEachColumn: Array<Nullable<DhouibAdjacencyMatrixRelation>> = [];
  private _events = new Map<keyof IDhouibAdjacencyMatrixEventMap, Array<(data: any) => void>>();

  selectMinimumValueFromEachColumn = () => {
    const result = this.horizontalHeaders.map((header) => {
      let lowestWeightedEdge: Nullable<DhouibAdjacencyMatrixRelation> = null;
      const cells = header.cells;
      for (let i = 0; i < cells.length; i++) {
        const currentCell = cells[i];
        if (!currentCell.edge?.data) continue;
        const currentCellValue = this._edgeValueGetter(currentCell.edge.data);
        if (lowestWeightedEdge === null || lowestWeightedEdge.edge!.data.distance > currentCellValue)
          lowestWeightedEdge = currentCell;
      }
      return lowestWeightedEdge;
    });
    this.minimumValuesOfEachColumn = result;
    this._events.get("columns-minimum-cell-select")?.forEach((cb) => cb(result));
  };

  on = <T extends keyof IDhouibAdjacencyMatrixEventMap>(
    eventType: T,
    callback: (data: IDhouibAdjacencyMatrixEventMap[T]) => void
  ) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, callback]);
  };
}

export default DhouibAdjacencyMatrix;
