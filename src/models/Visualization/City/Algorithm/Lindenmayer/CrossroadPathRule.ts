import { ICityLindenmayerSystemCharacter } from "@_types/context/city";
import { ICityGraphLindenmayerSystemCharacter } from "@_types/lindenmayerSystem";
import LindenmayerSystemHelper from "@helpers/lindenmayerSystem";
import CityGraphLindenmayerSystemCharacter from "@models/LinenmayerSystem/City/character";
import CoordinateHelper from "@helpers/Coordinate";
import LindenmayerCharacterForwardPathRule from "./ForwardPathRule";

class LindenmayerCharacterCrossroadPathRule extends CityGraphLindenmayerSystemCharacter<ICityLindenmayerSystemCharacter> {
  perform: (generation: number) => ICityGraphLindenmayerSystemCharacter<ICityLindenmayerSystemCharacter>[] = (gen) => {
    const length = 40;
    // vertex from previous generation
    const { x, y } = this.vertex.data;
    const angle = this.tensorField.get({ x, y });

    const regions = [
      LindenmayerSystemHelper.turnRight(this.data.expansionRegion),
      this.data.expansionRegion,
      LindenmayerSystemHelper.turnLeft(this.data.expansionRegion),
    ];

    const nextGen = regions.map((region) => {
      const finalAngle = LindenmayerSystemHelper.getAngleByRegion(angle, region);
      const { x: currentGenX, y: currentGenY } = CoordinateHelper.getNextPointByLengthAndAngle(
        { x, y },
        length,
        finalAngle
      );
      const vertex = this.graph.addVertex(`LSystem-Gen:${gen}`, { x: currentGenX, y: currentGenY });
      const distance = CoordinateHelper.getDistanceBetweenTwoPoints(this.vertex.data, vertex.data);
      this.graph.connect(vertex, this.vertex, { distance, traffic: 0, type: "major" });

      return new LindenmayerCharacterForwardPathRule(this.graph, this.tensorField, vertex, {
        expansionRegion: region,
      });
    });

    return nextGen;
  };
}

export default LindenmayerCharacterCrossroadPathRule;
