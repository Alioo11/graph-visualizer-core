import type { ICityGraphLindenmayerSystemCharacter } from "@_types/lindenmayerSystem";
import TensorField from "@models/TensorField";

abstract class CityGraphLindenmayerSystemCharacter<T> implements ICityGraphLindenmayerSystemCharacter<T> {
  constructor(
    public graph: ICityGraphLindenmayerSystemCharacter<T>["graph"],
    public tensorField: TensorField,
    public vertex: ICityGraphLindenmayerSystemCharacter<T>["vertex"],
    public data: T
  ) {}

  abstract perform: (generation: number) => ICityGraphLindenmayerSystemCharacter<T>[];
}

export default CityGraphLindenmayerSystemCharacter;
