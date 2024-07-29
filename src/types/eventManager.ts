export interface IEventManager<T> {
  on: <C extends keyof T>(eventType: C, cb: (cbData: T[C]) => void) => void;
  call: <C extends keyof T>(eventType: C, data: T[C]) => void;
}
