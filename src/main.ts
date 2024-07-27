import "./style.css";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

import * as PIXI from "pixi.js"
import { Application, Assets, Sprite, Spritesheet } from "pixi.js";

import backgroundImage from "/public/background.jpg";
import backTileImage from "/public/back_tile.png";
import bunnyImage from "/public/bunny.png";
import pipesData from "/public/pipes_spritesheet.json";
import pipesImage from "/public/pipes_spritesheet.png";

import Game from "./pipes/Game";

// Register the plugin.
gsap.registerPlugin(PixiPlugin);
// Give the plugin a reference to the PIXI object.
PixiPlugin.registerPIXI(PIXI);

// Create a PixiJS application.
const app = new Application();

// Register pixi app for debug plugin.
globalThis.__PIXI_APP__ = app;

async function setup()
{
    // Initialize the application.
    await app.init({ background: '#1099bb', resizeTo: window, resolution: window.devicePixelRatio, antialias: false });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
      { alias: 'background', src: backgroundImage },
      { alias: 'backTile', src: backTileImage },
      { alias: 'bunny', src: bunnyImage },
    ];

    // Load the assets defined above.
    await Assets.load(assets);

    // Load and cache spritesheet.
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

    // Add simple background.
    const bg = Sprite.from('background');
    bg.anchor.set(0.5);
    if (app.screen.width > app.screen.height) {
      bg.width = app.screen.width;
      bg.scale.y = bg.scale.x;
    } else {
      bg.height = app.screen.height;
      bg.scale.x = bg.scale.y;
    }
    bg.x = app.screen.width / 2;
    bg.y = app.screen.height / 2;
    app.stage.addChild(bg);

    bg.texture.source.scaleMode = 'nearest';


    const bunny = Sprite.from('bunny');
    app.stage.addChild(bunny);
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    let elapsed = 0.0;
    app.ticker.add((ticker) => {
      elapsed += ticker.deltaTime;
      bunny.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    });

    // Load level data.
    const level = (await Assets.load('level.json')).map;
    // Create a pipe game.
    const game = new Game(level);

    app.stage.addChild(game.field);

    game.field.scale = 0.75;
    game.field.x = app.screen.width / 2 - game.field.width / 2;
    game.field.y = app.screen.height / 2 - game.field.height / 2;

    onresize = () => {
      game.field.x = app.screen.width / 2 - game.field.width / 2;
      game.field.y = app.screen.height / 2 - game.field.height / 2;

      // TODO
      // resize();
    }
})();

// TODO
function resize() {
}