import { Container, Sprite } from "pixi.js";
import Pipe from "./Pipe";

const pipeSpriteWidth = 235;

export default class Field extends Container {
  constructor(map: Array<Array<string>> | null) {
    super();

    this.create(map ?? this.generateMap());
  }

  create(map: Array<Array<string>>) {
    map.forEach((row, i) => {
      row.forEach((pipeType, j) => {
        const tile = Sprite.from('backTile');

        tile.anchor.set(0.5);

        tile.scale.set(pipeSpriteWidth / tile.width);

        tile.x = pipeSpriteWidth * j;
        tile.y = pipeSpriteWidth * i;
        
        this.addChild(tile);

        if (pipeType !== '') {
          const pipe = new Pipe(pipeType);

          pipe.x = tile.x;
          pipe.y = tile.y;

          this.addChild(pipe);
        }
      })
    })
  }

  generateMap() : Array<Array<string>> {
    return [['r']]
  }
}
