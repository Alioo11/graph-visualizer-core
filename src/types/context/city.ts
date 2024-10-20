/** THIS CONTEXT PROVIDES THE REQUIRED VALUE OF CITY GENERATION */
type CityRoadType = "major" | "minor" | "local";

export interface ICityRoadGraphVertex {
  x: number;
  y: number;
}

export interface ICityRoadGraphEdge {
  type: CityRoadType;
  distance: number;
  traffic: number;
}

type ICityGraphLindenmayerSystemTensorFieldExpansionRegion = 0 | 1 | 2 | 3;

export interface ICityLindenmayerSystemCharacter {
  expansionRegion: ICityGraphLindenmayerSystemTensorFieldExpansionRegion;
}
