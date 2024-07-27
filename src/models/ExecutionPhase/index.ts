import type { Nullable } from "ts-wiz";
import type { IExecutionPhase, IVisualizationEventMap } from "@_types/executionPhase";

/**
 * keeps track of program execution phase
 */
class ExecutionPhase implements IExecutionPhase {
  phase: IExecutionPhase["phase"] = "initialized";
  private _events = new Map<keyof IVisualizationEventMap, Array<(data: any) => void>>();
  private static _instance: Nullable<ExecutionPhase> = null;
  
  private constructor(){};

  static instance() {
    if (this._instance === null) this._instance = new ExecutionPhase();
    return this._instance;
  }

  update(newPhase: IExecutionPhase["phase"]) {
    if(this.phase === newPhase) return;
    this.phase = newPhase;
    this._events.get("change")?.forEach(cb => cb(this.phase));
  }


  on = <T extends keyof IVisualizationEventMap>(eventType: T, callback: (data: IVisualizationEventMap[T]) => void) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, callback]);
  };
}

export default ExecutionPhase;
