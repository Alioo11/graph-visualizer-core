import wait from "@utils/wait";
import NumberUtils from "@utils/Number";
import type { VisualizationSpeed } from "../types/visualization";

const getWaiterFn = (speed: VisualizationSpeed) => {
  switch (speed) {
    case "fast":
      return () => NumberUtils.maybe(.9) && wait(1);
    case "normal":
      return () => wait(1);
    case "slow":
      return () => wait(100);
    default:
      return () => wait(1);
  }
};

export default getWaiterFn;
