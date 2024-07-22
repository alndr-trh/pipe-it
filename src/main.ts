import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

import bunnyImage from "/public/bunny.png";

gsap.registerPlugin(PixiPlugin);

import { Application, Assets, Sprite } from 'pixi.js';

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Load the bunny texture.
    const texture = await Assets.load(bunnyImage);

    // Create a new Sprite from an image path.
    const bunny = new Sprite(texture);

    // Add to stage.
    app.stage.addChild(bunny);

    // Center the sprite's anchor point.
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen.
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
})();
