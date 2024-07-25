import Map from "./Map";
import Field from "./Field";
import GameEvent from "../enum/GameEvent";

export default class Game {
  map: Map;
  
  field: Field;

  constructor(levelData: Array<Array<string>>) {
    this.map = new Map(levelData);
    this.field = new Field(this.map.get());

    this.field.events.on(GameEvent.PipeClick, (x, y) => {
      console.log(`x${x} y${y}`);

      this.field.update(this.map.rotatePipe(x, y));
    })
  }

  set x(val: number) {
    this.field.x = val;
  }

  set y(val: number) {
    this.field.y = val;
  }
}
