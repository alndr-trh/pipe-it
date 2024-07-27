import Map from "./Map";
import Field from "./Field";
import GameEvent from "../enum/GameEvent";

/**
 * Game class aimed to concat game logic with visualization.
 */
export default class Game {
  map: Map;
  
  field: Field;

  /**
   * Create a game and establish a simple interaction between game logic and visualization.
   * @param {Array<Array<string>>} rawData - Raw level data with pipes descriptors as string keys.
   */
  constructor(rawData: Array<Array<string>>) {
    this.map = new Map(rawData);
    this.field = new Field(this.map.data);

    this.field.events.on(GameEvent.PipeClick, (index) => {
      this.field.update(this.map.rotatePipe(index));
    })
  }

  set x(val: number) {
    this.field.x = val;
  }

  set y(val: number) {
    this.field.y = val;
  }
}
