import EventManager from "@models/EventManager";
import { Heap as HeapJs } from "heap-js";
import type { HeapEventMap } from "@_types/dataStructure/heap";

class Heap<T> extends HeapJs<T> {
  private _events = new EventManager<HeapEventMap<T>>();

  push(...elements: T[]): boolean {
    const res = super.push(...elements);
    this._events.call("push", elements);
    return res;
  }

  pop(): T | undefined {
    const poppedElement = super.pop();
    this._events.call("pop", poppedElement);
    return poppedElement;
  }

  on: EventManager<HeapEventMap<T>>["on"] = (eventType, cb) => {
    this._events.on(eventType, cb);
  };
}

export default Heap;
