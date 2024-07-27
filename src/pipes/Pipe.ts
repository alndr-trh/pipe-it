import Direction from "../enum/Direction";
import PipeType from "../enum/PipeType";
import PipeData from "./PipeData";

/**
 * Pipe logic class.
 */
export default class Pipe {
  _type: PipeType;

  _turnsCount: number;

  _isFilled: boolean;

  _isMain: boolean;

  _connections: Set<Direction>;

  /**
   * Initialize properties and setup pipe connections.
   * @param {PipeType} type - Pipe type.
   * @param {number} [turnsCount=1] - Basic number of turns made. One turn equals to 90 degrees clockwise.
   * @param {boolean} [isFilled=false] - Whether pipe is filled with water at start or not.
   * @param {boolean} [isMain=false] - Whether the pipe needs to be filled to complete the level.
   */
  constructor(type: PipeType, turnsCount: number = 1, isFilled: boolean = false, isMain: boolean = false) {
    this._type = type;
    this._turnsCount = turnsCount;
    this._isFilled = isFilled;
    this._isMain = isMain;
    
    this._connections = new Set();
    this._setupConnections();
  }

  /**
   * Setup pipe connections based on its type.
   */
  _setupConnections() {
    switch (this._type) {
      case PipeType.Straight:
        this._connections.add(Direction.Right).add(Direction.Left);
        break;
      case PipeType.Turning:
        this._connections.add(Direction.Right).add(Direction.Bottom);
        break;
      case PipeType.Branching:
        this._connections.add(Direction.Right).add(Direction.Bottom).add(Direction.Left);
        break;
      case PipeType.AllRound:
        this._connections.add(Direction.Right).add(Direction.Bottom).add(Direction.Left).add(Direction.Top);
        break;
      default:
        console.warn('Wrong pipe type parameter passed');
        break;
    }
  }

  /**
   * Update pipe turns count and connections.
   */
  rotate() {
    this._turnsCount += 1;

    const newConnections: Set<Direction> = new Set();
    this._connections.forEach((direction) => {
      newConnections.add((direction + 1) % 4);
    })

    this._connections = newConnections;
  }

  set turnsCount(turnsCount: number) {
    const turnsMade = turnsCount - this._turnsCount;
    for (let i = 0; i < turnsMade; ++i) {
      this.rotate();
    }
  }

  get isFilled(): boolean {
    return this._isFilled;
  }

  set isFilled(isFilled: boolean) {
    this._isFilled = isFilled;
  }

  get isMain(): boolean {
    return this._isMain;
  }

  set isMain(isMain: boolean) {
    this._isMain = isMain;
  }

  get data(): PipeData {
    return {
      key: `${this._type}${this._isFilled ? 'f' : ''}`,
      angle: 90 * (this._turnsCount - 1),
    }
  }

  get connections(): Set<Direction> {
    return this._connections;
  }
}
