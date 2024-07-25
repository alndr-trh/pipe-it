import { Container, EventEmitter, Sprite } from "pixi.js";
import Pipe from "./Pipe";
import GameEvent from "../enum/GameEvent";

const pipeSpriteWidth = 235;

export default class Field extends Container {
  _tiles: Array<Sprite>;
  
  _pipes: Array<Sprite>;

  _eventEmitter: EventEmitter;

  constructor(map: Array<Array<Pipe | null>>) {
    super();

    this._tiles = [];
    this._pipes = [];

    this._eventEmitter = new EventEmitter();

    this.create(map);
  }

  create(map: Array<Array<Pipe | null>>) {
    map.forEach((row, i) => {
      row.forEach((pipeData, j) => {
        const tile = Sprite.from('backTile');
        this._tiles.push(tile);

        tile.scale.set(pipeSpriteWidth / tile.width);

        tile.x = pipeSpriteWidth * j;
        tile.y = pipeSpriteWidth * i;
        
        this.addChild(tile);
        
        if (!pipeData) {
          return;
        }

        const pipe = Sprite.from(`${pipeData.type}${pipeData.isFilled ? 'f' : ''}`);
        this._pipes.push(pipe);
        console.log(pipe);

        pipe.anchor.set(0.5);
        if (pipeData.turnsCount) pipe.angle += 90 * (pipeData.turnsCount - 1);

        pipe.x = tile.x + pipeSpriteWidth / 2;
        pipe.y = tile.y + pipeSpriteWidth / 2;

        if (!pipeData.isMain) {
          pipe.eventMode = 'dynamic';
          pipe.on('pointerdown', () => {
            this._eventEmitter.emit(GameEvent.PipeClick, i, j);
          })
        }

        this.addChild(pipe);
      })
    })
  }

  update(updatedMap: Array<Array<Pipe | null>>) {
    let pipesCounter = 0;

    updatedMap.forEach((row, i) => {
      row.forEach((pipeData, j) => {
        if (!pipeData) {
          return;
        }

        const isFilledNow = this._pipes[pipesCounter].texture.label.includes('f');
        if ((pipeData.isFilled && !isFilledNow) || (!pipeData.isFilled && isFilledNow)) {
          // TODO
          // fill pipe
        }

        // TODO
        console.log(pipeData.turnsCount)
        if (typeof pipeData.turnsCount === 'number' && pipeData.turnsCount != (((this._pipes[pipesCounter].angle / 90) % 4) + 1)) {
          this._pipes[pipesCounter].angle += 90;
        }

        pipesCounter += 1;
      })
    })
  }

  get events(): EventEmitter {
    return this._eventEmitter;
  }
}
