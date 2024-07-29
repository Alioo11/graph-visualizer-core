import type { Maybe } from "ts-wiz";

export interface HeapEventMap<T> {
  push: Array<T>;
  pop: T | undefined;
}
