import $ from "jquery";
import DhouibAdjacencyMatrix from "@models/DataStructure/AdjacencyMatrix/DhouibAdjacencyMatrix";
import View from "@models/View";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";
import type { DhouibAdjacencyMatrixRelation } from "@_types/context/dhouib";

const CELL_SIZE = 40;

class MatrixView extends View<unknown> {
  documentRef: Nullable<HTMLDivElement> = null;
  dataStructure: DhouibAdjacencyMatrix;
  private _headerDocumentMap = new Map<string, JQuery<HTMLElement>>();
  private _relationDocumentMap = new Map<string, JQuery<HTMLElement>>();
  private _minColumnListDocumentMap = new Map<string, JQuery<HTMLElement>>();

  constructor(adjacencyMatrix: DhouibAdjacencyMatrix) {
    super();
    this.dataStructure = adjacencyMatrix;
  }

  onReady: Nullable<NoneToVoidFunction> = () => {
    this._initialRender();
    this.registerEvents();
  };

  private registerEvents() {
    if (!this.documentRef) throw new Error("document ref has not been initialized");
    this.dataStructure.on("add-to-min-column-list", (cell) => this.addRelationToMinColumnList(cell));
    this.dataStructure.on("remove-from-min-column-list", (cell) => this.deleteRelationFromMinColumnList(cell));
    this.dataStructure.on("add-to-mst-path", (r) => this.addToMSTPath(r));
    this.dataStructure.on("add-to-candidate-relations", (r) => this.addCandidateRelation(r));
  }

  private addCandidateRelation(cell: DhouibAdjacencyMatrixRelation) {
    const documentElement = this._relationDocumentMap.get(cell.id);
    if (!documentElement) throw new Error(`could not find document cell element with id: ${cell.id}`);

    documentElement.css("background-color", "yellow");
  }

  counter = 0;

  private addToMSTPath(cell: DhouibAdjacencyMatrixRelation) {
    const relationDocumentElement = this._relationDocumentMap.get(cell.id);
    const minColumnListDocument = this._minColumnListDocumentMap.get(cell.id);
    const verticalHeaderDocument = this._headerDocumentMap.get(cell.verticalVertexRef.id);
    const horizontalHeaderDocument = this._headerDocumentMap.get(cell.horizontalVertexRef.id);

    const relationDocumentElementPeer = this._relationDocumentMap.get(cell.peer!.id);
    if (!minColumnListDocument) return;
    if (!verticalHeaderDocument) return;
    if (!horizontalHeaderDocument) return;

    relationDocumentElement?.css("background-color", "red");
    relationDocumentElementPeer?.css("background-color", "red");

    // this.counter ++;

    const DX = (cell.x - this.dataStructure.size) * CELL_SIZE;
    const DY = this.dataStructure.size * CELL_SIZE;

    const minColumnListDocumentClone = minColumnListDocument.clone();
    minColumnListDocument.remove();

    minColumnListDocumentClone
      .css("left", DX)
      .css("top", DY)
      .text(cell.verticalVertexRef.vertex.label + cell.horizontalVertexRef.vertex.label);
    minColumnListDocumentClone.animate({ top: CELL_SIZE * (this.dataStructure.MSTPath.length - 1), left: 0 }, 1000);

    const mstPathDocumentElement = $("#dhouib-vertical-footer");
    mstPathDocumentElement.append(minColumnListDocumentClone);
  }

  private changeCellStatus(cell: DhouibAdjacencyMatrixRelation) {
    const documentElement = this._relationDocumentMap.get(cell.id);
    if (cell.data.status === "candidate") documentElement?.css("background-color", "yellow");
    if (cell.data.status === "selected") documentElement?.css("background-color", "red");
  }

  private addRelationToMinColumnList(cell: Nullable<DhouibAdjacencyMatrixRelation>) {
    if (cell === null) return;
    const documentElement = this._relationDocumentMap.get(cell.id);
    if (!documentElement) throw new Error(`could not find document cell element with id: ${cell.id}`);
    const footerElement = $("#dhouib-horizontal-footer");
    const elementClone = documentElement.clone();
    this._minColumnListDocumentMap.set(cell.id, elementClone);
    const topOffset = CELL_SIZE * (this.dataStructure.size - cell.y);
    const leftOffset = CELL_SIZE * cell.x;
    elementClone
      .css("background-color", "lightblue")
      .css("position", "absolute")
      .css("top", `-${topOffset}px`)
      .css("left", `${leftOffset}px`);
    elementClone.animate({ top: 0 }, 200);
    elementClone.appendTo(footerElement);
  }

  private deleteRelationFromMinColumnList(cell: Nullable<DhouibAdjacencyMatrixRelation>) {
    if (cell === null) return;
    const documentElement = this._minColumnListDocumentMap.get(cell.id);
    if (!documentElement) throw new Error(`could not find document cell element with id: ${cell.id}`);
    this._minColumnListDocumentMap.delete(cell.id);
    documentElement.remove();
  }

  private _initialRender() {
    if (!this.documentRef) throw new Error("document ref has not been initialized");
    const relations = this.dataStructure.relations;
    const horizontalHeaders = this.dataStructure.horizontalHeaders;
    const verticalHeaders = this.dataStructure.verticalHeaders;

    const docRef = $(this.documentRef);
    const container = $("<div></div>").width(400).height(400).addClass("d-flex").addClass("flex-column");
    const tableWrapper = $("<div></div>").addClass("d-flex");
    docRef.append(container);

    const horizontalHeader = $("<div></div>")
      .addClass("d-flex")
      .css("margin-left", CELL_SIZE)
      .addClass("dhouib-horizontal-header")
      .width(horizontalHeaders.length * CELL_SIZE)
      .height(CELL_SIZE);

    for (let i = 0; i < horizontalHeaders.length; i++) {
      const horizontalHeaderCell = $("<div></div>").width(CELL_SIZE).height(CELL_SIZE).addClass("dhouib-header-cell");
      horizontalHeaderCell.text(horizontalHeaders[i].vertex.label);
      horizontalHeader.append(horizontalHeaderCell);
      this._headerDocumentMap.set(horizontalHeaders[i].id, horizontalHeaderCell);
    }

    const horizontalFooter = $("<div></div>")
      .addClass("d-flex")
      .attr("id", "dhouib-horizontal-footer")
      .css("margin-left", CELL_SIZE)
      .css("position", "relative")
      .addClass("dhouib-horizontal-header")
      .width(horizontalHeaders.length * CELL_SIZE)
      .height(CELL_SIZE);

    const verticalFooter = $("<div></div>")
      .attr("id", "dhouib-vertical-footer")
      .addClass("d-flex")
      .addClass("flex-column")
      .css("position", "relative")
      .css("width", `${CELL_SIZE}px`)
      .addClass("dhouib-vertical-footer");

    const verticalHeader = $("<div></div>")
      .addClass("d-flex")
      .addClass("flex-column")
      .addClass("dhouib-vertical-header");
    for (let i = 0; i < verticalHeaders.length; i++) {
      const verticalHeaderCell = $("<div></div>").width(CELL_SIZE).height(CELL_SIZE).addClass("dhouib-header-cell");
      verticalHeaderCell.text(verticalHeaders[i].vertex.label);
      verticalHeader.append(verticalHeaderCell);
      this._headerDocumentMap.set(verticalHeaders[i].id, verticalHeaderCell);
    }

    const tableContainer = $("<table></table>")
      .width(relations.length * CELL_SIZE)
      .attr("id", "dhouib-table")
      .addClass("dhouib-table");
    for (let i = 0; i < relations.length; i++) {
      const tableRow = $("<tr></tr>")
        .height(CELL_SIZE)
        .width(relations.length * CELL_SIZE)
        .addClass("dhouib-table-row");
      for (let j = 0; j < relations[i].length; j++) {
        let cellContent = relations[i][j].edge !== null ? relations[i][j].edge?.data.distance : "";
        const tableCell = $("<td></td>")
          .width(CELL_SIZE)
          .height(CELL_SIZE)
          .addClass("dhouib-table-cell")
          .text(cellContent || "");
        this._relationDocumentMap.set(relations[i][j].id, tableCell);
        tableRow.append(tableCell);
      }
      tableContainer.append(tableRow);
    }

    container.append(horizontalHeader);
    container.append(tableWrapper);

    tableWrapper.append(verticalHeader);
    tableWrapper.append(tableContainer);
    tableWrapper.append(verticalFooter);

    container.append(horizontalFooter);
  }
}

export default MatrixView;
