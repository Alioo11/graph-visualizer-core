import { Nullable } from "ts-wiz";

class StackEntry<T> {
  bottom: Nullable<StackEntry<T>> = null;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

class Stack<T> {
  private _top: Nullable<StackEntry<T>> = null;
  private _length = 0;

  pop() {
    if (this._top === null) return null;
    const topValue = this._top;
    this._top = this._top.bottom;
    this._length -= 1;
    return this._top?.data
  }

  push(data: T) {
    const entry = new StackEntry(data);
    entry.bottom = this._top;
    this._top = entry;
    this._length += 1;
  }

  get length() {
    return this._length;
  }
}

export default Stack;
