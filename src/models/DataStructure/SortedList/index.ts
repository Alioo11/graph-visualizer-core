import type { ISortedList, SortedListResolver } from "@_types/dataStructure/sortedList";

class SortedList<T> implements ISortedList<T> {
  private _elements: Array<T> = [];
  private _resolver: SortedListResolver<T>;

  private _isBeforeRange(value: number) {
    const [element] = this.elements;
    if(!element) throw new Error('cant get first element of list');
    const firstElement = this._resolver(element);
    return firstElement > value;
  }

  private _isAfterRange(value: number) {
    const lastValue = this.elements[this.elements.length - 1];
    if(!lastValue) throw new Error('cant get last element of list');
    const lastElement = this._resolver(lastValue);
    return lastElement < value;
  }

  private _isInRange(value: number) {
    const isAfter = this._isAfterRange(value);
    const isBefore = this._isBeforeRange(value);
    return !(isAfter || isBefore);
  }

  private _binarySearchForNearestIndex = (value: number): number => {
    let low = 0;
    let high = this.elements.length - 1;
    let bestIndex = -1;

    if (this.elements.length === 0) return -1;

    if (this._isBeforeRange(value)) return -1;
    if (this._isAfterRange(value)) return this.elements.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const result = this._resolver(this.elements[mid]);

      if (result === value) {
        return mid;
      }

      if (result < value) {
        bestIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return bestIndex + 1;
  };


  private _binarySearchForNearestIndex2 = (value: number): number => {
    let low = 0;
    let high = this.elements.length - 1;
    let bestIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const result = this._resolver(this.elements[mid]);

      if (result === value) {
        return mid;
      }

      if (result < value) {
        bestIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return bestIndex;
  };


  public getClosestIndex: ISortedList<T>["getClosestIndex"] = (index) => {
    return this._binarySearchForNearestIndex(index);
  };

  public getElementInRange: ISortedList<T>["getElementInRange"] = (from, to) => {
    if (from >= to) return [];

    const bothElementAreAfterRange = this._isAfterRange(from) && this._isAfterRange(to)
    const bothElementAreBeforeRange = this._isBeforeRange(from) && this._isBeforeRange(to)

    if (bothElementAreAfterRange || bothElementAreBeforeRange) return [];

    const nearestFrom = this._binarySearchForNearestIndex(from)
    const nearestTo = this._binarySearchForNearestIndex(to);

    const leftCap = Math.max(0, nearestFrom);
    const rightCap = this._isAfterRange(to) ? this.elements.length : nearestTo;

    return this._elements.slice(leftCap, rightCap);
  };

  public add: ISortedList<T>["add"] = (element) => {
    const comparisonValue = this._resolver(element);
    const itemIndex = this._binarySearchForNearestIndex2(comparisonValue);
    this._elements.splice(itemIndex + 1, 0, element);
  };

  get elements() {
    return this._elements;
  }

  constructor(resolver: SortedListResolver<T>) {
    this._resolver = resolver;
  }
}

export default SortedList;
