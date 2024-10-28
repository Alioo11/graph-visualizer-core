import { coordinate } from "@_types/coordinate";
import Line from "@models/Line";

describe('Line', () => {
  test('should find intersection within the bounds of both line segments', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 4, y: 4 });
    const line2 = new Line({ x: 0, y: 4 }, { x: 4, y: 0 });

    const intersection = line1.intersectionCoordinate(line2);

    expect(intersection).toEqual({ x: 2, y: 2 });
  });

  test('should return null for parallel lines', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 4, y: 4 });
    const line2 = new Line({ x: 0, y: 1 }, { x: 4, y: 5 });

    const intersection = line1.intersectionCoordinate(line2);

    expect(intersection).toBeNull();
  });

  test('should return null if intersection is outside the bounds of the line segments', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 2, y: 2 });
    const line2 = new Line({ x: 3, y: 3 }, { x: 5, y: 5 });

    const intersection = line1.intersectionCoordinate(line2);

    expect(intersection).toBeNull();
  });

  test('should handle intersection at the end of a line segment', () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 4, y: 4 });
    const line2 = new Line({ x: 4, y: 4 }, { x: 8, y: 0 });

    const intersection = line1.intersectionCoordinate(line2);

    expect(intersection).toEqual({ x: 4, y: 4 });
  });


  describe("Line", () => {
    let line: Line;
  
    beforeEach(() => {
      line = new Line({ x: 0, y: 0 }, { x: 4, y: 4 });
    });
  
    test("should calculate the center of the line correctly", () => {
      const center = line.center
      expect(center).toEqual({ x: 2, y: 2 });
    });
  
    test("should rotate the line 90 degrees around the center", () => {
      line.rotate(Math.PI / 2);
      const expectedFrom: coordinate = { x: 4, y: 0 };
      const expectedTo: coordinate = { x: 0, y: 4 };
      
      expect(line.from.x).toBeCloseTo(expectedFrom.x, 5);
      expect(line.from.y).toBeCloseTo(expectedFrom.y, 5);
      expect(line.to.x).toBeCloseTo(expectedTo.x, 5);
      expect(line.to.y).toBeCloseTo(expectedTo.y, 5);
    });
  
    test("should rotate the line 45 degrees around the center", () => {
      line.rotate(Math.PI / 2);
      const expectedFrom: coordinate = { x: 4, y: 0 };
      const expectedTo: coordinate = { x: 0, y: 4 };

      expect(line.from.x).toBeCloseTo(expectedFrom.x, 5);
      expect(line.from.y).toBeCloseTo(expectedFrom.y, 5);
      expect(line.to.x).toBeCloseTo(expectedTo.x, 5);
      expect(line.to.y).toBeCloseTo(expectedTo.y, 5);
    });
  
    test("should grow the line by a factor of 2 from the center", () => {
      line.grow(2); // Grow the line by 2x from the center
      const expectedFrom: coordinate = { x: -2, y: -2 };
      const expectedTo: coordinate = { x: 6, y: 6 };
  
      expect(line.from.x).toBeCloseTo(expectedFrom.x, 5);
      expect(line.from.y).toBeCloseTo(expectedFrom.y, 5);
      expect(line.to.x).toBeCloseTo(expectedTo.x, 5);
      expect(line.to.y).toBeCloseTo(expectedTo.y, 5);
    });
  
    test("should grow the line by a factor of 0.5 from the center", () => {
      line.grow(0.5); // Shrink the line by half from the center
      const expectedFrom: coordinate = { x: 1, y: 1 };
      const expectedTo: coordinate = { x: 3, y: 3 };
  
      expect(line.from.x).toBeCloseTo(expectedFrom.x, 5);
      expect(line.from.y).toBeCloseTo(expectedFrom.y, 5);
      expect(line.to.x).toBeCloseTo(expectedTo.x, 5);
      expect(line.to.y).toBeCloseTo(expectedTo.y, 5);
    });
  });
});