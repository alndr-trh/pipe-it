import { Container, EventEmitter, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";

import GameEvent from "../enum/GameEvent";
import MapData from "./MapData";

/**
 * Class responsible for pipe game visualization.
 * @extends Container
 */
export default class Field extends Container {
  _tiles: Array<Sprite>;
  _pipes: Array<Sprite>;

  _eventEmitter: EventEmitter;

  /**
   * Initialize properties and create a field.
   * @param {MapData} mapData - Main map sizing info with presented pipes in it.
   */
  constructor(mapData: MapData) {
    super();

    this._tiles = [];
    this._pipes = [];

    this._eventEmitter = new EventEmitter();

    this._create(mapData);
  }

  /**
   * Iterate over map data to create a field with proper sizes and pipes in positions.
   * Add simple interactivity to pipes.
   * @param {MapData} mapData - Main map sizing info with presented pipes in it.
   */
    _create(mapData: MapData) {
      for (let i = 0; i < mapData.height; ++i) {
        for (let j = 0; j < mapData.width; ++j) {
          this._addTile(j * mapData.tileSize, i * mapData.tileSize, mapData.tileSize);
        }
      }
  
      mapData.pipes.forEach((pipeData, index) => {
        const pipeSprite = this._addPipe(pipeData.key, pipeData.angle, pipeData.x, pipeData.y, mapData.tileSize);
  
        pipeSprite.eventMode = 'dynamic';
        pipeSprite.on('pointerdown', () => {
          this._eventEmitter.emit(GameEvent.PipeClick, index);
        })
      })
    }

  /**
   * Create a tile sprite and add it to field.
   * @param {number} x - Sprite x position on field.
   * @param {number} y - Sprite y position on field.
   * @param {number} maxWidth - Tile max size in px.
   */
  _addTile(x: number, y: number, maxWidth: number) {
    const tile = Sprite.from('backTile');
    this._tiles.push(tile);

    tile.scale.set(maxWidth / tile.width);

    tile.x = x;
    tile.y = y;
    
    this.addChild(tile);
  }

  /**
   * Create a pipe sprite and add it to field.
   * @param {string} key - Texture key in assets cache.
   * @param {number} angle - Start sprite angle.
   * @param {number} x - Sprite x position on field.
   * @param {number} y - Sprite y position on field.
   * @param {number} tileSize - Tile size in px (used to calculate proper position relative to tile sprite).
   * @returns {Sprite} Pipe sprite.
   */
  _addPipe(key: string, angle: number, x: number, y: number, tileSize: number): Sprite {
    const pipe = Sprite.from(key);
    this._pipes.push(pipe);

    pipe.anchor.set(0.5);
    pipe.angle = angle;

    pipe.x = x * tileSize + tileSize / 2;
    pipe.y = y * tileSize + tileSize / 2;

    this.addChild(pipe);

    return pipe;
  }

  /**
   * Update field visuals (rotate, fill pipes etc.) using updated map data.
   * @param {MapData} updatedMap - Updated main map info.
   */
  update(updatedMap: MapData) {
    this._pipes.forEach((pipe, index) => {
      // Update pipe sprite texture to filled/unfilled.
      if (pipe.texture.label != updatedMap.pipes[index].key) {
        pipe.texture = Texture.from(updatedMap.pipes[index].key);
      }

      // Rotate pipe sprite (usually clicked one).
      if (pipe.angle != updatedMap.pipes[index].angle) {
        gsap.to(pipe, { angle: updatedMap.pipes[index].angle, duration: 0.225 });
        const scaleTimeline = gsap.timeline();
        scaleTimeline
          .to(pipe, { pixi: { scale: 0.85 }, duration: 0.110 })
          .to(pipe, { pixi: { scale: 1 }, duration: 0.110 });
      }
    })
  }

  get events(): EventEmitter {
    return this._eventEmitter;
  }
}
