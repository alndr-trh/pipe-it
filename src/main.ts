import "./style.css";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);

import { Application, Assets, Sprite, Spritesheet } from "pixi.js";

import backTileImage from "/public/back_tile.png";
import bunnyImage from "/public/bunny.png";
import pipesData from "/public/pipes_spritesheet.json";
import pipesImage from "/public/pipes_spritesheet.png";

import Field from "./pipes/Field";

// Create a PixiJS application.
const app = new Application();

// Register pixi app for debug plugin
globalThis.__PIXI_APP__ = app;

async function setup()
{
    // Initialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
      { alias: 'backTile', src: backTileImage },
      { alias: 'bunny', src: bunnyImage },
    ];

    // Load the assets defined above.
    await Assets.load(assets);


    // Load and cache spritesheet
    const pipesTexture = await Assets.load(pipesImage);
    const pipesSpritesheet = new Spritesheet(pipesTexture, pipesData);
    await pipesSpritesheet.parse();
    Assets.cache.set('pipes', pipesSpritesheet);
}

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();

    // Create a new Sprite from an image ally.
    const bunny = Sprite.from('bunny');

    // Add to stage.
    app.stage.addChild(bunny);

    // Center the sprite's anchor point.
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen.
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    let elapsed = 0.0;
    app.ticker.add((ticker) => {
      elapsed += ticker.deltaTime;
      bunny.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    });

    const field = new Field([
      ['r', '-2', '-'],
      ['r', '+', '-'],
      ['r', '+', 'r']])

    field.x = app.screen.width / 2;
    field.y = app.screen.height / 2;

    app.stage.addChild(field);
})();
