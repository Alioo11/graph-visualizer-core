import { ICityLindenmayerSystemCharacter } from "@_types/context/city";
import { ICityGraphLindenmayerSystemCharacter } from "@_types/lindenmayerSystem";
import LindenmayerSystemHelper from "@helpers/lindenmayerSystem";
import CityGraphLindenmayerSystemCharacter from "@models/LinenmayerSystem/City/character";
import CoordinateHelper from "@helpers/Coordinate";
import LindenmayerCharacterCrossroadPathRule from "./CrossroadPathRule";
import NumberUtils from "@utils/Number";

class LindenmayerCharacterForwardPathRule extends CityGraphLindenmayerSystemCharacter<ICityLindenmayerSystemCharacter> {
  perform: (generation: number) => ICityGraphLindenmayerSystemCharacter<ICityLindenmayerSystemCharacter>[] = (gen) => {
    const length = 40;
    // vertex from previous generation
    const { x, y } = this.vertex.data;
    const angle = this.tensorField.get({ x, y });

    const performableAngle = LindenmayerSystemHelper.getAngleByRegion(angle, this.data.expansionRegion);

    const { x: currentGenX, y: currentGenY } = CoordinateHelper.getNextPointByLengthAndAngle(
      { x, y },
      length,
      performableAngle + NumberUtils.randomNumberBetween(-Math.PI/8,Math.PI/8)
    );

    const count = this.graph.getVertexCountByRadius({x:currentGenX , y:currentGenY}, 45)

    if(count > 1){ 
      const [_ , vs , __, vss] = this.graph.getNearestVertex(this.vertex.data, 45);
      if(vs === this.vertex) return [];
      this.graph.connect(vs , this.vertex , {distance:0 , type:"major" , traffic:0})
      return [];
    }

    const currentGenVertex = this.graph.addVertex(`LSystem-Gen::${gen}`, { x: currentGenX, y: currentGenY });
    const distance = CoordinateHelper.getDistanceBetweenTwoPoints(this.vertex.data, currentGenVertex.data);
    this.graph.connect(this.vertex, currentGenVertex, { traffic: 0, type: "major", distance: distance });

    const nextGenerationAngle = this.tensorField.get({ x: currentGenX, y: currentGenY });

    /** left forward right */
    const possibleRegions = [
      LindenmayerSystemHelper.turnLeft(this.data.expansionRegion),
      this.data.expansionRegion,
      LindenmayerSystemHelper.turnRight(this.data.expansionRegion),
    ].map((region) => {
      const angle = LindenmayerSystemHelper.getAngleByRegion(nextGenerationAngle, region);

      const coordinate = CoordinateHelper.getNextPointByLengthAndAngle(
        { x: currentGenX, y: currentGenY },
        length,
        angle
      );

      return { region, count: this.graph.getVertexCountByRadius(coordinate, 36) };
    });


    let [bestRegion] = possibleRegions.sort((a, b) => a.count - b.count);
    
    // if (bestRegion.count > 1) return [];

    if (NumberUtils.maybe(0.6) && gen > 1) {
      const crossGen = new LindenmayerCharacterCrossroadPathRule(this.graph, this.tensorField, currentGenVertex, {
        expansionRegion: this.data.expansionRegion,
      });
      return [crossGen];
    }

    const forwardGen = new LindenmayerCharacterForwardPathRule(this.graph, this.tensorField, currentGenVertex, {
      expansionRegion: this.data.expansionRegion,
    });


    return [forwardGen];
  };
}

export default LindenmayerCharacterForwardPathRule;
