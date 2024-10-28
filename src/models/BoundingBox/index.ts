import { IBoundingBox } from "@_types/boundingBox";
import { coordinate } from "@_types/coordinate";
import Line from "@models/Line";

class BoundingBox implements IBoundingBox {
  private _lines: Array<Line> = [];
  private _topLeft: coordinate;
  private _bottomRight: coordinate;

  get width() {
    return Math.abs(this._topLeft.x - this._bottomRight.x);
  }

  get height() {
    return Math.abs(this._topLeft.y - this._bottomRight.y);
  }

  get chord() {
    return Math.sqrt(this.width ** 2 + this.height ** 2);
  }

  constructor(topLeft: coordinate, bottomRight: coordinate) {
    this._topLeft = topLeft;
    this._bottomRight = bottomRight;

    const { x: TLx, y: TLy } = topLeft;
    const { x: BRx, y: BRy } = bottomRight;

    const topLine = new Line({ x: TLx, y: TLy }, { x: TLx + this.width, y: TLy });
    const bottomLine = new Line({ x: BRx - this.width, y: BRy }, { x: BRx, y: BRy });

    const leftLine = new Line({ x: TLx, y: TLy }, { x: TLx, y: TLy + this.height });
    const rightLine = new Line({ x: BRx, y: BRy - this.height }, { x: BRx, y: BRy });

    this._lines = [topLine, bottomLine, rightLine, leftLine];
  }
  lineIntersections: IBoundingBox["lineIntersections"] = (line) => {
    const intersections: Array<coordinate> = [];

    this._lines.forEach((boundingBoxLine) => {
      const coordinate = line.intersectionCoordinate(boundingBoxLine);
      if (coordinate !== null) intersections.push(coordinate);
    });

    return intersections;
  };
}


export default BoundingBox;