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


  private _minColumnList: Array<Nullable<DhouibAdjacencyMatrixRelation>> = Array.from(new Array(this.size).keys(),()=>null);
  private _MSTPath: Array<DhouibAdjacencyMatrixRelation> = [];
  private _candidateRelations = new Map<DhouibAdjacencyMatrixRelation["id"] , DhouibAdjacencyMatrixRelation>();

  private _events = new Map<keyof IDhouibAdjacencyMatrixEventMap, Array<(data: any) => void>>();

  addToMinColumnList(relation:DhouibAdjacencyMatrixRelation){
    this._minColumnList[relation.x] = relation;
    this._events.get("add-to-min-column-list")?.forEach(cb => cb(relation));
  }

  removeFromMinColumnList(index:number){
    const valueAtIndex = this._minColumnList[index];
    this._minColumnList[index] = null;
    this._events.get("remove-from-min-column-list")?.forEach(cb => cb(valueAtIndex));
  }


  addToMSTPath(relation:DhouibAdjacencyMatrixRelation){
    relation.edge = null;
    relation.peer && (relation.peer.edge = null);
    this._MSTPath.push(relation);
    this._minColumnList[relation.x] = null;
    this._events.get("add-to-mst-path")?.forEach(cb => cb(relation));
  }


  addToCandidateRelations(relation:DhouibAdjacencyMatrixRelation){
    if(this._candidateRelations.has(relation.id)) return;
    this._candidateRelations.set(relation.id , relation);
    this._events.get("add-to-candidate-relations")?.forEach(cb => cb(relation));
  }


  get MSTPath(){
    return this._MSTPath
  }

  get candidateRelations(){
    return this._candidateRelations;
  }

  get minColumnList(){
    return this._minColumnList;
  }



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
    this._minColumnList = result;
    this._events.get("create-min-columns-list")?.forEach((cb) => cb(result));
  };

  selectMaxValueFromMinColumnList = () => {
    let maxValue: Nullable<DhouibAdjacencyMatrixRelation> = null

    for(let i = 0 ; i < this._minColumnList.length ; i++){
      const currentCell = this._minColumnList[i];
      if (!currentCell?.edge?.data) continue;
      const currentCellValue = this._edgeValueGetter(currentCell.edge.data);
      if(maxValue === null) {
        maxValue = currentCell;
        continue
      }
      if (currentCellValue > this._edgeValueGetter(maxValue.edge!.data)) maxValue = currentCell
    }
    this._events.get("min-columns-list-max-value-select")?.forEach((cb) => cb(maxValue));

    return maxValue
  };

  updateRelation = (
    relationId: string,
    updateCb: (data: DhouibAdjacencyMatrixRelation["data"]) => DhouibAdjacencyMatrixRelation["data"]
  ) => {
    const relation = this.relationIdMap.get(relationId);
    if (!relation) throw new Error(`could not find relation with id ${relationId}`);
    const updatedState = updateCb(relation["data"]);
    const didRelationStatusChange = updatedState.status !== relation.data.status;
    relation.data = updatedState;
    if (didRelationStatusChange) this._events.get("relation-change-status")?.forEach((cb) => cb(relation));
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
