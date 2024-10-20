import CoordinateHelper from "@helpers/Coordinate";
import type { coordinate } from "@_types/coordinate"; // Adjust the import path to your types

describe("CoordinateHelper", () => {
  const pointA: coordinate = { x: 0, y: 0 };
  const pointB: coordinate = { x: 3, y: 4 };
  const pointC: coordinate = { x: -4, y: -3 };

  describe("getAngleBetweenPoints", () => {
    test("should return the correct angle between two points", () => {
      const angle = CoordinateHelper.getAngleBetweenPoints(pointA, pointB);
      // atan2(4, 3) should return 0.93 radians (approximately)
      expect(angle).toBeCloseTo(0.93, 2);
    });

    test("should return a negative angle when appropriate", () => {
      const angle = CoordinateHelper.getAngleBetweenPoints(pointA, pointC);
      // atan2(-3, -4) should return -2.5 radians (approximately)
      expect(angle).toBeCloseTo(-2.5, 2);
    });

    test("should return 0 when points are on the same x-axis", () => {
      const sameXAxis = { x: 5, y: 0 };
      const angle = CoordinateHelper.getAngleBetweenPoints(pointA, sameXAxis);
      expect(angle).toBe(0);
    });

    test("should return pi/2 when points are vertically aligned", () => {
      const sameYAxis = { x: 0, y: 5 };
      const angle = CoordinateHelper.getAngleBetweenPoints(pointA, sameYAxis);
      expect(angle).toBeCloseTo(Math.PI / 2, 2);
    });
  });

  describe("getDistanceBetweenTwoPoints", () => {
    test("should return the correct distance between two points", () => {
      const distance = CoordinateHelper.getDistanceBetweenTwoPoints(pointA, pointB);
      // distance between (0,0) and (3,4) should be 5 (3-4-5 triangle)
      expect(distance).toBe(5);
    });

    test("should return 0 when points are the same", () => {
      const distance = CoordinateHelper.getDistanceBetweenTwoPoints(pointA, pointA);
      expect(distance).toBe(0);
    });

    test("should return the correct distance for negative coordinates", () => {
      const distance = CoordinateHelper.getDistanceBetweenTwoPoints(pointA, pointC);
      // distance between (0,0) and (-4,-3) should also be 5 (similar triangle)
      expect(distance).toBe(5);
    });
  });

  describe("getNextPointByLengthAndAngle", () => {
    test("should return the same point when length is 0", () => {
      const nextPoint = CoordinateHelper.getNextPointByLengthAndAngle(pointA, 0, Math.PI);
      expect(nextPoint).toEqual(pointA);
    });
  });
});
