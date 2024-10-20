import SortedList from "@models/DataStructure/SortedList";
import NumberUtils from "@utils/Number";
import type { SortedListResolver } from "@_types/dataStructure/sortedList";

describe("SortedList", () => {
  interface TestElement {
    value: number;
  }

  const resolver: SortedListResolver<TestElement> = (element) => element.value;

  let sortedList: SortedList<TestElement>;

  beforeEach(() => {
    sortedList = new SortedList<TestElement>(resolver);
  });

  describe("add", () => {
    it("should add elements in a sorted order based on resolver", () => {
      sortedList.add({ value: 5 });
      sortedList.add({ value: 3 });
      sortedList.add({ value: 10 });
      sortedList.add({ value: 1 });

      expect(sortedList.elements.map((e) => e.value)).toEqual([1, 3, 5, 10]);
    });

    it("should add elements in a sorted order based on resolver with random cases", () => {
        const randomNumbers = NumberUtils.createRandomNumberList(10, 0, 20).map((i) => ({ value: i }));
        const randomNumbersCopy = [...randomNumbers];
        randomNumbersCopy.sort((a, b) => a.value - b.value);

        randomNumbers.forEach((element) => sortedList.add(element));

        expect(sortedList.elements.map((i) => i.value)).toEqual(randomNumbersCopy.map((i) => i.value));

    });

    it("should add elements in a sorted order based on resolver with random cases and negative values", () => {
      const randomNumbers = NumberUtils.createRandomNumberList(10, -20, 20).map((i) => ({ value: i }));
      const randomNumbersCopy = [...randomNumbers];
      randomNumbersCopy.sort((a, b) => a.value - b.value);

      randomNumbers.forEach((element) => sortedList.add(element));

      expect(sortedList.elements.map((i) => i.value)).toEqual(randomNumbersCopy.map((i) => i.value));

  });

  it("should add elements in a sorted order based on resolver with random cases and negative values", () => {
    const randomNumbers = NumberUtils.createRandomNumberList(200, -20, 20).map((i) => ({ value: i }));
    const randomNumbersCopy = [...randomNumbers];
    randomNumbersCopy.sort((a, b) => a.value - b.value);

    randomNumbers.forEach((element) => sortedList.add(element));

    expect(sortedList.elements.map((i) => i.value)).toEqual(randomNumbersCopy.map((i) => i.value));

});


  });

  describe("getClosestIndex", () => {
    it("should return the closest index for a given value", () => {
      sortedList.add({ value: -15 });
      sortedList.add({ value: -5 });
      sortedList.add({ value: 5 });
      sortedList.add({ value: 10 });
      sortedList.add({ value: 15 });
      sortedList.add({ value: 25 });
      sortedList.add({ value: 30 });

      /** the numbers are on the left side of the range */
      expect(sortedList.getClosestIndex(-30)).toBe(-1);
      expect(sortedList.getClosestIndex(-15)).toBe(0);

      /** the numbers are on the middle side of the range */
      expect(sortedList.getClosestIndex(-10)).toBe(1);
      expect(sortedList.getClosestIndex(0)).toBe(2);
      expect(sortedList.getClosestIndex(10)).toBe(3);
      expect(sortedList.getClosestIndex(15)).toBe(4);

      // /** the numbers are on the right side of the range */
      expect(sortedList.getClosestIndex(30)).toBe(6);
      expect(sortedList.getClosestIndex(50)).toBe(6);
    });

    it("should return -1 when list is empty", () => {
      expect(sortedList.getClosestIndex(5)).toBe(-1);
    });
  });

  describe("getElementInRange", () => {
    it("should return elements within the specified range", () => {
      sortedList.add({ value: -4 });
      sortedList.add({ value: -2 });
      sortedList.add({ value: -1 });
      sortedList.add({ value: 1 });
      sortedList.add({ value: 3 });
      sortedList.add({ value: 5 });
      sortedList.add({ value: 10 });
      sortedList.add({ value: 15 });

      // Range from 3 to 10 should return elements with values [3, 5, 10]
      const rangeElements = sortedList.getElementInRange(-3, -5).map((e) => e.value);
      expect(rangeElements).toEqual([]);

      const rangeElements2 = sortedList.getElementInRange(-6, 0).map((e) => e.value);
      expect(rangeElements2).toEqual([-4, -2, -1]);

      // Range from 4 to 12 should return elements with values [5, 10]
      const rangeElements3 = sortedList.getElementInRange(4, 12).map((e) => e.value);
      expect(rangeElements3).toEqual([5, 10]);

      // Range from 0 to 20 should return all elements
      const rangeElements4 = sortedList.getElementInRange(0, 20).map((e) => e.value);
      expect(rangeElements4).toEqual([1, 3, 5, 10, 15]);
    });

    it("should return elements within the specified range", () => {
      sortedList.add({ value: -4 });

      // Range from 3 to 10 should return elements with values [3, 5, 10]
      const rangeElements = sortedList.getElementInRange(-10, -3).map((e) => e.value);
      expect(rangeElements).toEqual([-4]);

    });

    it("should return an empty array if no elements are in the range", () => {
      sortedList.add({ value: 1 });
      sortedList.add({ value: 3 });
      sortedList.add({ value: 5 });

      const rangeElements = sortedList.getElementInRange(6, 8);
      expect(rangeElements).toEqual([]);

      const rangeElements2 = sortedList.getElementInRange(-10, -8);
      expect(rangeElements2).toEqual([]);

      const rangeElements3 = sortedList.getElementInRange(5, -8);
      expect(rangeElements3).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should handle adding elements to an empty list", () => {
      sortedList.add({ value: 5 });
      expect(sortedList.elements.map((e) => e.value)).toEqual([5]);
    });

    it("should handle adding multiple elements with the same value", () => {
      sortedList.add({ value: 5 });
      sortedList.add({ value: 5 });
      sortedList.add({ value: 5 });

      expect(sortedList.elements.map((e) => e.value)).toEqual([5, 5, 5]);
    });
  });
});
