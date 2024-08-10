import EventManager from "@models/EventManager";
import { Comparator, Heap as HeapJs } from "heap-js";
import type { HeapEventMap } from "@_types/dataStructure/heap";

class Heap<T> extends HeapJs<T> {
  private _events: EventManager<HeapEventMap<T>>;

  constructor(compare?: Comparator<T> | undefined) {
    super(compare);
    this._events = new EventManager<HeapEventMap<T>>();
  }

  push(...elements: T[]): boolean {
    const res = super.push(...elements);
    this._events.emit("push", elements);
    return res;
  }

  pop(): T | undefined {
    const poppedElement = super.pop();
    this._events.emit("pop", poppedElement);
    return poppedElement;
  }

  on: EventManager<HeapEventMap<T>>["on"] = (eventType, cb) => {
    this._events.on(eventType, cb);
  };
}

export default Heap;
