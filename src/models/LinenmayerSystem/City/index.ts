import type { ICityGraphLindenmayerSystem, ICityGraphLindenmayerSystemCharacter } from "@_types/lindenmayerSystem";
import type { NoneToVoidFunction } from "ts-wiz";

class CityGraphLindenmayerSystem<T> implements ICityGraphLindenmayerSystem<T> {
  private _generation = 0;
  characters: Array<ICityGraphLindenmayerSystemCharacter<T>> = [];
  constructor(axiom: Array<ICityGraphLindenmayerSystemCharacter<T>>) {
    this.characters = axiom;
  }

  get generation() {
    return this._generation;
  }

  iter: NoneToVoidFunction = () => {
    this._generation += 1;
    const nextGenerationCharacters: Array<ICityGraphLindenmayerSystemCharacter<T>> = [];

    for (let i = 0; i < this.characters.length; i++) {
      const currentCharacter = this.characters[i];
      const nextGenChars = currentCharacter.perform(this.generation);
      nextGenerationCharacters.push(...nextGenChars);
    }
    this.characters = nextGenerationCharacters;
  };
}

export default CityGraphLindenmayerSystem;
