/** @description `IVisualizationStatusMap` maps visualization status-code into a readable status */
export interface IExecutionPhaseMap {
  10: "initialized";

  20: "preparing";
  21: "prepared";

  30: "visualization-in-progress";
  31: "visualization-done";
}

type IExecutionPhaseMapUnion = IExecutionPhaseMap[keyof IExecutionPhaseMap];

export interface IExecutionPhase {
  phase: IExecutionPhaseMapUnion;
  on: <T extends keyof IVisualizationEventMap>(
    eventType: T,
    eventCb: (eventData: IVisualizationEventMap[T]) => void
  ) => void;
}

export interface IVisualizationEventMap {
  change: IExecutionPhaseMap[keyof IExecutionPhaseMap];
}
