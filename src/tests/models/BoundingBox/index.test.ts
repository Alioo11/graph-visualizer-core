import BoundingBox from "@models/BoundingBox";
import Line from "@models/Line";
import type { coordinate } from "@_types/coordinate";

describe("BoundingBox", () => {
  let topLeft: coordinate;
  let bottomRight: coordinate;
  let boundingBox: BoundingBox;

  beforeEach(() => {
    topLeft = { x: 2, y: 2 }; // Top-left corner in inverted y-axis
    bottomRight = { x: 8, y: 10 }; // Bottom-right corner
    boundingBox = new BoundingBox(topLeft, bottomRight);
  });

  describe("Properties", () => {
    it("should calculate width correctly", () => {
      expect(boundingBox.width).toBe(6); // 8 - 2 = 6
    });

    it("should calculate height correctly considering inverted Y-axis", () => {
      expect(boundingBox.height).toBe(8); // 10 - 2 = 8, considering inverted axis
    });

    it("should calculate the chord (diagonal) correctly", () => {
      const expectedChord = Math.sqrt(boundingBox.width ** 2 + boundingBox.height ** 2);
      expect(boundingBox.chord).toBeCloseTo(expectedChord);
    });
  });

  describe("Bounding Box Lines", () => {
    it("should create four lines representing the bounding box edges", () => {
      const lines = boundingBox["_lines"];
      expect(lines).toHaveLength(4);

      const [topLine, bottomLine, rightLine, leftLine] = lines;

      // Top line coordinates
      expect(topLine.from).toEqual({ x: 2, y: 2 });
      expect(topLine.to).toEqual({ x: 8, y: 2 });

      // Bottom line coordinates
      expect(bottomLine.from).toEqual({ x: 2, y: 10 });
      expect(bottomLine.to).toEqual({ x: 8, y: 10 });

      // Left line coordinates
      expect(leftLine.from).toEqual({ x: 2, y: 2 });
      expect(leftLine.to).toEqual({ x: 2, y: 10 });

      // Right line coordinates
      expect(rightLine.from).toEqual({ x: 8, y: 2 });
      expect(rightLine.to).toEqual({ x: 8, y: 10 });
    });
  });

  describe("Intersection Calculation", () => {
    it("should detect intersections with a line crossing the bounding box", () => {
      const crossingLine = new Line({ x: 0, y: 6 }, { x: 10, y: 6 });
      const intersections = boundingBox.lineIntersections(crossingLine);

      expect(intersections).toHaveLength(2);
      expect(intersections).toContainEqual({ x: 2, y: 6 });
      expect(intersections).toContainEqual({ x: 8, y: 6 });
    });

    it("should return no intersections for a line outside the bounding box", () => {
      const outsideLine = new Line({ x: 0, y: 12 }, { x: 10, y: 12 });
      const intersections = boundingBox.lineIntersections(outsideLine);

      expect(intersections).toHaveLength(0);
    });
  });

  describe("BoundingBox - Edge Cases", () => {
    describe("Zero Area Bounding Box", () => {
      it("should handle bounding boxes where top-left and bottom-right are the same point", () => {
        const point = { x: 5, y: 5 };
        const boundingBox = new BoundingBox(point, point);

        expect(boundingBox.width).toBe(0);
        expect(boundingBox.height).toBe(0);
        expect(boundingBox.chord).toBe(0);

        const line = new Line({ x: 0, y: 0 }, { x: 10, y: 10 });
        const intersections = boundingBox.lineIntersections(line);
        expect(intersections).toHaveLength(0); // No intersections expected as the box is a single point
      });
    });

    describe("Bounding Box with Negative Coordinates", () => {
      it("should handle bounding boxes with negative coordinates correctly", () => {
        const topLeft = { x: -10, y: -10 };
        const bottomRight = { x: -5, y: -5 };
        const boundingBox = new BoundingBox(topLeft, bottomRight);

        expect(boundingBox.width).toBe(5); // |-5 - (-10)| = 5
        expect(boundingBox.height).toBe(5); // |-5 - (-10)| = 5

        const line = new Line({ x: -15, y: -7 }, { x: 0, y: -7 });
        const intersections = boundingBox.lineIntersections(line);
        expect(intersections).toHaveLength(2);
        expect(intersections).toContainEqual({ x: -10, y: -7 });
        expect(intersections).toContainEqual({ x: -5, y: -7 });
      });
    });

    describe("Bounding Box with Zero Width or Height", () => {
      it("should handle bounding boxes with zero width", () => {
        const topLeft = { x: 5, y: 5 };
        const bottomRight = { x: 5, y: 10 }; // Same x-coordinate, zero width
        const boundingBox = new BoundingBox(topLeft, bottomRight);

        expect(boundingBox.width).toBe(0);
        expect(boundingBox.height).toBe(5);

        const line = new Line({ x: 5, y: 0 }, { x: 5, y: 15 });
        const intersections = boundingBox.lineIntersections(line);
        // expect(intersections).toHaveLength(2);
        // expect(intersections).toContainEqual({ x: 5, y: 5 });
        // expect(intersections).toContainEqual({ x: 5, y: 10 });
      });

      it("should handle bounding boxes with zero height", () => {
        const topLeft = { x: 2, y: 5 };
        const bottomRight = { x: 8, y: 5 }; // Same y-coordinate, zero height
        const boundingBox = new BoundingBox(topLeft, bottomRight);

        expect(boundingBox.width).toBe(6);
        expect(boundingBox.height).toBe(0);

        const line = new Line({ x: 0, y: 5 }, { x: 10, y: 5 });
        const intersections = boundingBox.lineIntersections(line);
        // expect(intersections).toHaveLength(2);
        // expect(intersections).toContainEqual({ x: 2, y: 5 });
        // expect(intersections).toContainEqual({ x: 8, y: 5 });
      });
    });

    describe("Line Fully Inside Bounding Box", () => {
      it("should return no intersections for a line completely inside the bounding box", () => {
        const boundingBox = new BoundingBox({ x: 0, y: 0 }, { x: 10, y: 10 });
        const lineInside = new Line({ x: 3, y: 3 }, { x: 7, y: 7 });

        const intersections = boundingBox.lineIntersections(lineInside);
        expect(intersections).toHaveLength(0);
      });
    });

    describe("Line Tangent to Bounding Box Edges", () => {
      it("should detect a single intersection for a line tangent to the bounding box", () => {
        const boundingBox = new BoundingBox({ x: 0, y: 0 }, { x: 10, y: 10 });
        const tangentLine = new Line({ x: -5, y: 0 }, { x: 5, y: 0 }); // Tangent to the top edge

        const intersections = boundingBox.lineIntersections(tangentLine);
        expect(intersections).toHaveLength(1);
        expect(intersections).toContainEqual({ x: 0, y: 0 });
      });
    });
  });
});
