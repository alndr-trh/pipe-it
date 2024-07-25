export default interface Pipe {
  // type: PipeType,
  type: string,
  turnsCount?: number,
  isFilled: boolean,
  isMain?: boolean,
}

// import { Container, Sprite } from "pixi.js";
// import { gsap } from "gsap";

// export default class Pipe extends Container {
//   constructor(type: string) {
//     super();

//     const lastChar = type.substring(type.length - 1);

//     let pipe;

//     if (Number(lastChar)) {
//       pipe = Sprite.from(`${type.substring(0, type.length - 1)}.png`);
//       pipe.angle = 90 * (Number(lastChar) - 1)
//     } else {
//       pipe = Sprite.from(`${type}.png`);
//     }

//     pipe.anchor.set(0.5);

//     this.addChild(pipe);

//     pipe.on('pointerdown', (event) => {
//       gsap.to(pipe, { angle: (pipe.angle - (pipe.angle % 90)) + 90, duration: 0.225 });
//       const scaleTimeline = gsap.timeline();
//       scaleTimeline
//         .to(pipe, { pixi: { scale: 0.85 }, duration: 0.110 })
//         .to(pipe, { pixi: { scale: 1 }, duration: 0.110 });
//     });
//     pipe.eventMode = 'dynamic';
//   }
// }
