import { Graphics, SCALE_MODES } from 'pixi.js';
import TestApp from './TestApp';
import Shape from './Shape';

export default class StarShape extends Shape {
    constructor(x: number, y: number, color: number, size: number, points: number, app: TestApp) {
        super(x, y, app, { color, size, points });
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {
        graphics.drawStar(0, 0, drawOptions.points, drawOptions.size, .2*drawOptions.size + .8*drawOptions.size*Math.random(), 0);
        graphics.endFill();
    }

}