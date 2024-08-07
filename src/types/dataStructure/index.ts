/**
 * @description the common interface between all data structures
 * the iter should return a iterator object " [Symbol.iter] "
 */
export interface IDataStructure<T> {
  size: number;
  iter: () => IterableIterator<T>;
}
