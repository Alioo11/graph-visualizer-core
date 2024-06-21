import { NoneToVoidFunction, Nullable } from "ts-wiz";
import View from "../../View";
import DhouibAdjacencyMatrix from "@models/DataStructure/AdjacencyMatrix/DhouibAdjacencyMatrix";
import $ from "jquery";
import { DhouibAdjacencyMatrixRelation } from "../../../types/dhouib";

const CELL_SIZE = 40;

class MatrixView extends View<unknown> {
  documentRef: Nullable<HTMLDivElement> = null;
  dataStructure: DhouibAdjacencyMatrix;
  private _cellDocumentMap = new Map<string, JQuery<HTMLElement>>();

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
    this.dataStructure.on("columns-minimum-cell-select", (relations) => relations.forEach( r =>this.pullDownRelation(r)));
  }

  private pullDownRelation(cell: Nullable<DhouibAdjacencyMatrixRelation>) {
    if(cell === null) return;
    const documentElement = this._cellDocumentMap.get(cell.id);
    if (!documentElement) throw new Error(`could not find document cell element with id: ${cell.id}`);
    const footerElement = $("#dhouib-horizontal-footer");
    const elementClone = documentElement.clone();

    const topOffset = CELL_SIZE * (this.dataStructure.size - cell.y);
    const leftOffset = CELL_SIZE * (cell.x);

    elementClone.css("background-color", "lightblue").css("position", "absolute").css("top", `-${topOffset}px`).css("left", `${leftOffset}px`)
    elementClone.animate({ top: 0 }, 2000);
    elementClone.appendTo(footerElement);
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
    }

    const horizontalFooter = $("<div></div>")
      .addClass("d-flex")
      .attr("id", "dhouib-horizontal-footer")
      .css("margin-left", CELL_SIZE)
      .css("position", "relative")
      .addClass("dhouib-horizontal-header")
      .width(horizontalHeaders.length * CELL_SIZE)
      .height(CELL_SIZE);

    const verticalHeader = $("<div></div>")
      .addClass("d-flex")
      .addClass("flex-column")
      .addClass("dhouib-horizontal-header");
    for (let i = 0; i < verticalHeaders.length; i++) {
      const verticalHeaderCell = $("<div></div>").width(CELL_SIZE).height(CELL_SIZE).addClass("dhouib-header-cell");
      verticalHeaderCell.text(verticalHeaders[i].vertex.label);
      verticalHeader.append(verticalHeaderCell);
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
        this._cellDocumentMap.set(relations[i][j].id, tableCell);
        tableRow.append(tableCell);
      }
      tableContainer.append(tableRow);
    }

    container.append(horizontalHeader);
    container.append(tableWrapper);

    tableWrapper.append(verticalHeader);
    tableWrapper.append(tableContainer);
    container.append(horizontalFooter);
  }
}

export default MatrixView;
