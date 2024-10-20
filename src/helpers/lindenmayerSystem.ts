import type { ICityLindenmayerSystemCharacter } from "@_types/context/city";

class LindenmayerSystemHelper {
  static turnRight(
    dir: ICityLindenmayerSystemCharacter["expansionRegion"]
  ): ICityLindenmayerSystemCharacter["expansionRegion"] {
    return ((dir + 1) % 4) as ICityLindenmayerSystemCharacter["expansionRegion"];
  }

  static turnLeft(
    dir: ICityLindenmayerSystemCharacter["expansionRegion"]
  ): ICityLindenmayerSystemCharacter["expansionRegion"] {
    const leftValue = dir - 1;
    return (leftValue < 0 ? 4 : leftValue) as ICityLindenmayerSystemCharacter["expansionRegion"];
  }

  static getAngleByRegion(angle: number, region: ICityLindenmayerSystemCharacter["expansionRegion"]) {
    return angle + region * (Math.PI / 2);
  }
}

export default LindenmayerSystemHelper;
