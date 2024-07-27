import Pipe from "./Pipe";
import PipeType from "../enum/PipeType";
import Direction from "../enum/Direction";
import MapData from "./MapData";
import PipeData from "./PipeData";

const defaultSpriteWidth = 235;

/**
 * Pipe game logic class.
 */
export default class Map {
  _pipes: Array<Pipe>;

  _data: MapData;

  /**
   * Initialize properties and process raw map data.
   * @param {Array<Array<string>>} rawData - Raw level data with pipes descriptors as string keys.
   */
  constructor(rawData: Array<Array<string>>) {
    this._pipes = [];

    if (rawData) {
      this.parse(rawData);
    } else {
      // TODO
      // this.generate();
    }
  }

  /**
   * Create a pipe and its data based on raw map data.
   * @param {string} rawData - pipe string descriptor (type, angle, etc.).
   * @returns {PipeType} Sharable pipe data.
   */
  _parsePipeData(rawData: string): PipeData {
    const pipeType = rawData[0] as PipeType;

    const pipe: Pipe = new Pipe(pipeType);
    this._pipes.push(pipe);

    if (/\d/.test(rawData)) {
      console.log(rawData[1])
      pipe.turnsCount = Number(rawData[1]);
    }

    if (rawData.includes('f')) {
      pipe.isFilled = true;
    }

    if (rawData.includes('m')) {
      pipe.isMain = true;
    }

    return pipe.data;
  }

  /**
   * Search for an connected pipe in a given direction.
   * @param {number} index - Source pipe array index.
   * @param {Direction} direction - Direction to search.
   * @returns {number | null} Connected pipe index if found.
   */
  _findPipe(index: number, direction: Direction): number | null {
    // Choose coordinate to search based on direction.
    const searchKey = (direction == Direction.Right || direction == Direction.Left) ? 'x' : 'y';
    const searchValue: number = this._data.pipes[index][searchKey] + ((direction == Direction.Right || direction == Direction.Bottom) ? 1 : -1);

    const parallel = (searchKey == 'x') ? 'y' : 'x';

    if (direction == Direction.Right || direction == Direction.Bottom) {
      // Search for a pipe further in array.
      for (let i = index; i < this._data.pipes.length; ++i) {
        if (this._data.pipes[i][parallel] !== this._data.pipes[index][parallel]) continue; 

        if (this._data.pipes[i][searchKey] == searchValue && this._pipes[i].connections.has((direction + 2) % 4)) {
          return i;
        }
      }
    } else {
      // Search for a pipe earlier in array.
      for (let i = index; i >= 0; --i) {
        if (this._data.pipes[i][parallel] !== this._data.pipes[index][parallel]) continue; 

        if (this._data.pipes[i][searchKey] == searchValue && this._pipes[i].connections.has((direction + 2) % 4)) {
          return i;
        }
      }
    }

    return null;
  }

  /**
   * Recursive function to go through connected pipes if fill status changed and update it.
   * @param {number} index - Source pipe array index.
   */
  _updatePipeFill(index: number) {
    const pipe = this._pipes[index];

    let fillDirection: Direction | null;
    let connectedPipeIndex: number;

    pipe.isFilled = pipe.isMain;

    // Go through connected pipes and fill itself if adjacent pipe is filled.
    pipe.connections.forEach((direction) => {
      connectedPipeIndex = this._findPipe(index, direction);
      if (typeof connectedPipeIndex != 'number') {
        return;
      }

      if (this._pipes[connectedPipeIndex].isFilled && !pipe.isFilled) {
        fillDirection = direction;
        pipe.isFilled = true;
      }
    })

    // Update pipe sharable data based on fill results.
    this._data.pipes[index] = { ...pipe.data, x: this._data.pipes[index].x, y: this._data.pipes[index].y };

    // TODO
    // Update other adjacent pipes based current pipe status
    pipe.connections.forEach((nonFilledDirection) => {
      if (nonFilledDirection == fillDirection) {
        return;
      }
        
      connectedPipeIndex = this._findPipe(index, nonFilledDirection);
      if (typeof connectedPipeIndex != 'number') {
        return;
      }
  
      if (this._pipes[connectedPipeIndex].isFilled != pipe.isFilled) {
        this._updatePipeFill(connectedPipeIndex);
      }
    })
  }

  /**
   * Process raw level data to fill map data.
   * @param {Array<Array<string>>} rawData - Raw level data with pipes descriptors as string keys.
   */
  async parse(rawData: Array<Array<string>>) {
    this._data = { width: rawData.length, height: rawData[0].length, tileSize: defaultSpriteWidth, pipes: [] };

    rawData.forEach((row, i) => {
      row.forEach((dataElement, j) => {
        if (dataElement == '') {
          return;
        }

        const pipeData: PipeData = this._parsePipeData(dataElement);
        pipeData.x = j;
        pipeData.y = i;

        this._data.pipes.push(pipeData);
      })
    })
  }

  // TODO
  // generate() {}

  /**
   * Rotate pipe and update data if needed.
   * @param {number} index - Pipe array index to rotate.
   * @returns {MapData} Updated map data.
   */
  rotatePipe(index: number): MapData {
    const rotatedPipe = this._pipes[index];

    const oldConnections = new Set<Direction>(rotatedPipe.connections);

    rotatedPipe.rotate();

    // TODO
    // leftover connections
    rotatedPipe.connections.forEach((connection) => oldConnections.delete(connection));
    oldConnections.forEach((direction) => {
      let connectedPipeIndex = this._findPipe(index, direction);
      if (typeof connectedPipeIndex != 'number') {
        return;
      }

      this._pipes[connectedPipeIndex].isFilled = this._pipes[connectedPipeIndex].isMain;

      this._updatePipeFill(connectedPipeIndex);
    })


    // FIX
    this._data.pipes[index] = { ...rotatedPipe.data, x: this._data.pipes[index].x, y: this._data.pipes[index].y };

    this._updatePipeFill(index);

    return this._data;
  }

  get data(): MapData {
    return this._data;
  }
}
