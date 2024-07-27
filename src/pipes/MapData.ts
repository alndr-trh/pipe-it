import PipeData from "./PipeData";

type MapData = {
  width: number;
  height: number;
  tileSize: number;
  pipes?: Array<PipeData>;
}

export default MapData;
