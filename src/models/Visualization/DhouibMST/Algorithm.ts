import DhouibAdjacencyMatrix from "@models/DataStructure/AdjacencyMatrix/DhouibAdjacencyMatrix";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";
import wait from "@utils/wait";
import type { Nullable } from "ts-wiz";
import type { DhouibAdjacencyMatrixRelation } from "@_types/dhouib";
import type { IAlgorithm } from "@_types/algorithm";

class DhouibMST implements IAlgorithm {
  private graph: DhouibGraph;
  private adjacencyMatrix: DhouibAdjacencyMatrix;

  private _lockedRelations = new Set();

  constructor(graph: DhouibGraph, adjacencyMatrix: DhouibAdjacencyMatrix) {
    this.graph = graph;
    this.adjacencyMatrix = adjacencyMatrix;
  }

  reset() {}

  private initialFillMinColumnList() {
    const result = this.adjacencyMatrix.horizontalHeaders.map((header) => {
      let lowestWeightedEdge: Nullable<DhouibAdjacencyMatrixRelation> = null;
      const cells = header.cells;
      for (let i = 0; i < cells.length; i++) {
        const currentCell = cells[i];
        if (!currentCell.edge?.data) continue;
        const currentCellValue = currentCell.edge.data.distance;
        if (lowestWeightedEdge === null || lowestWeightedEdge.edge!.data.distance > currentCellValue)
          lowestWeightedEdge = currentCell;
      }
      return lowestWeightedEdge;
    });
    result.forEach((res) => res && this.adjacencyMatrix.addToMinColumnList(res));
  }

  private findValueFromMinColumnList(opt: "biggest" | "smallest") {
    let value: Nullable<DhouibAdjacencyMatrixRelation> = null;
    for (let i = 0; i < this.adjacencyMatrix.minColumnList.length; i++) {
      const currentCell = this.adjacencyMatrix.minColumnList[i];
      if (!currentCell?.edge?.data) continue;
      const currentCellValue = currentCell.edge.data.distance;
      if (value === null) {
        value = currentCell;
        continue;
      }
      if (opt === "biggest" && currentCellValue > value.edge!.data.distance) value = currentCell;
      if (opt === "smallest" && currentCellValue < value.edge!.data.distance) value = currentCell;
    }
    if (!value) throw new Error(`got ${value} when searching min-column-list`);
    return value;
  }

  private selectRelation(relation: DhouibAdjacencyMatrixRelation) {
    if (relation.edge) this.graph.updateEdge(relation.edge.id, (e) => ({ ...e, status: "connected" }));
    this.adjacencyMatrix.addToMSTPath(relation);
    // if(relation.edge) this.graph.updateEdge(relation.edge.id ,e => ({...e , status:"connected"}) );
    const neighbors = [
      ...relation.verticalVertexRef.cells,
      ...relation.horizontalVertexRef.cells,
      ...relation.peer!.verticalVertexRef.cells,
      ...relation.peer!.horizontalVertexRef.cells,
    ];

    relation.verticalVertexRef.cells.forEach((cellInSameRow) => {
      const shouldBeBlocked = this.adjacencyMatrix.minColumnList.find((rel) => rel?.id === cellInSameRow.id);
      if (shouldBeBlocked) {
        this._lockedRelations.add(shouldBeBlocked.id);
        this._lockedRelations.add(shouldBeBlocked.peer!.id);
      }
    });

    relation.peer!.verticalVertexRef.cells.forEach((cellInSameRow) => {
      const shouldBeBlocked = this.adjacencyMatrix.minColumnList.find((rel) => rel?.id === cellInSameRow.id);
      if (shouldBeBlocked) {
        this._lockedRelations.add(shouldBeBlocked.id);
        this._lockedRelations.add(shouldBeBlocked.peer!.id);
      }
    });

    for (let i in neighbors) {
      const currentNeighbor = neighbors[i];
      this.adjacencyMatrix.addToCandidateRelations(currentNeighbor);
      if (currentNeighbor.edge) this.graph.updateEdge(currentNeighbor.edge.id, (e) => ({ ...e, status: "candidate" }));
    }
  }

  private findMinOfEveryColumn() {
    const minColumnList: Array<DhouibAdjacencyMatrixRelation> = [];
    for (const v of this.adjacencyMatrix.horizontalHeaders) {
      const isColumnFull = v.cells.every((c) => this.adjacencyMatrix.candidateRelations.has(c.id));
      if (!isColumnFull) continue;
      let minValueSoFar: Nullable<DhouibAdjacencyMatrixRelation> = null;
      for (const relation of v.cells) {
        if (relation.edge === null) continue;
        if (this.adjacencyMatrix.MSTPath.find((i) => i.id === relation.id)) continue;
        if (this._lockedRelations.has(relation.id)) continue;
        if (minValueSoFar === null) {
          minValueSoFar = relation;
          continue;
        }
        if (relation.edge.data.distance < minValueSoFar.edge!.data.distance) minValueSoFar = relation;
      }
      if (minValueSoFar) minColumnList.push(minValueSoFar);
    }
    return minColumnList;
  }

  private _handleAddToMCL(rel: DhouibAdjacencyMatrixRelation) {
    this.adjacencyMatrix.addToMinColumnList(rel);
  }

  private async secondSolution() {
    this.initialFillMinColumnList(); // loop in relations and add the minimum value of each column to min-column-list
    const biggestValueFromMinColumnList = this.findValueFromMinColumnList("biggest");

    const removeAbleValuesFromMinColumnList = this.adjacencyMatrix.minColumnList.filter(
      (relation) => relation !== biggestValueFromMinColumnList
    );
    removeAbleValuesFromMinColumnList.forEach((rel) => rel && this.adjacencyMatrix.removeFromMinColumnList(rel.x));
    this.selectRelation(biggestValueFromMinColumnList);

    while (this.adjacencyMatrix.candidateRelations.size !== this.adjacencyMatrix.size ** 2) {
      await wait(2000);
      this.findMinOfEveryColumn().forEach((i) => this._handleAddToMCL(i));
      const nextPick = this.findValueFromMinColumnList("smallest");
      const removeAbleValuesFromMinColumnList = this.adjacencyMatrix.minColumnList.filter(
        (relation) => relation !== nextPick
      );
      await wait(2000);
      this.selectRelation(nextPick);
      removeAbleValuesFromMinColumnList.forEach((rel) => rel && this.adjacencyMatrix.removeFromMinColumnList(rel.x));
    }
  }

  fn1() {
    this.initialFillMinColumnList();
    const biggestValueFromMinColumnList = this.findValueFromMinColumnList("biggest");

    const removeAbleValuesFromMinColumnList = this.adjacencyMatrix.minColumnList.filter(
      (relation) => relation !== biggestValueFromMinColumnList
    );
    removeAbleValuesFromMinColumnList.forEach((rel) => rel && this.adjacencyMatrix.removeFromMinColumnList(rel.x));
    this.selectRelation(biggestValueFromMinColumnList);
    this._step++;
  }

  fn2() {
    this.findMinOfEveryColumn().forEach((i) => this._handleAddToMCL(i));
    const nextPick = this.findValueFromMinColumnList("smallest");
    const removeAbleValuesFromMinColumnList = this.adjacencyMatrix.minColumnList.filter(
      (relation) => relation !== nextPick
    );
    this.selectRelation(nextPick);
    removeAbleValuesFromMinColumnList.forEach((rel) => rel && this.adjacencyMatrix.removeFromMinColumnList(rel.x));
  }

  private _step = 0;

  iter = () => {
    return true;
  };

  performFastForward = null;
}

export default DhouibMST;
