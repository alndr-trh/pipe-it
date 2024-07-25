import { Assets } from "pixi.js";

import Pipe from "./Pipe";
import PipeType from "../enum/PipeType";

// interface Pipe {
//   // type: PipeType,
//   type: string,
//   turnsCount?: number,
//   isFilled: boolean,
//   isMain?: boolean,
// }

export default class Map {
  _width: number;
  _height: number;

  _data: Array<Array<Pipe | null>>;

  constructor(rawData: Array<Array<string>>) {
    this._width = 0;
    this._height = 0;

    this._data = [];

    if (rawData) {
      this.parse(rawData);
    } else {
      this.generate();
    }
  }

  _parsePipeData(pipeData: string): Pipe | null {
    const pipeType = pipeData[0];
    if (!pipeType) {
      return null;
    }

    const pipe: Pipe = { type: pipeType, isFilled: false };
    if (pipeData.length == 4) {
      pipe.turnsCount = pipeData[1] as unknown as number;
      pipe.isFilled = true;
      pipe.isMain = true;
    } else if (pipeData.length == 3) {
      if (!pipeData.includes('m')) {
        pipe.turnsCount = pipeData[1] as unknown as number;
        pipe.isFilled = true;
      } else if (!pipeData.includes('f')) {
        pipe.turnsCount = pipeData[1] as unknown as number;
        pipe.isMain = true;
      } else {
        pipe.isFilled = true;
        pipe.isMain = true;
      }
    } else if (pipeData.length == 2) {
      if (pipeData.includes('m')) {
        pipe.isMain = true;
      } else if (pipeData.includes('f')) {
        pipe.isFilled = true;
      } else {
        pipe.turnsCount = pipeData[1] as unknown as number;
      }
    }

    return pipe;
  }

  async parse(rawData: Array<Array<string>>) {
    this._height = rawData.length;
    this._width = rawData[0].length;

    for (let row of rawData) {
      this._data.push([]);
      for (let dataElement of row) {
        this._data.at(-1).push(this._parsePipeData(dataElement));
      }
    }
  }

  // TODO
  generate() {}

  rotatePipe(x: number, y: number): Array<Array<Pipe | null>> {
    this._data[x][y].turnsCount = (((this._data[x][y].turnsCount ?? 1) + 1) % 4);
    return this._data;
  }

  get(): Array<Array<Pipe | null>> {
    return this._data;
  }
}
