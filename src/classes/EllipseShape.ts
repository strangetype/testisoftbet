import { Graphics, SCALE_MODES } from 'pixi.js';
import TestApp from './TestApp';
import Shape from './Shape';

export default class EllipseShape extends Shape {
    constructor(x: number, y: number, color: number, radius: number, app: TestApp) {
        super(x, y, app, { color, radius });
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {
        let r1 = (.2+.8*Math.random())*drawOptions.radius;
        let r2 = drawOptions.radius - r1;
        graphics.drawEllipse(0, 0, r1, r2);
        graphics.endFill();
    }

}