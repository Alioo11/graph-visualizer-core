export type SortedListResolver<T> = (element: T) => number;

export interface ISortedList<T> {
  elements: Array<T>;
  getClosestIndex: (index: number) => number;
  getElementInRange: (from: number, to: number) => Array<T>;
  add: (element: T) => void;
  //   remove: (element: T) => void;
}
