import { Graphics, SCALE_MODES } from 'pixi.js';
import TestApp from './TestApp';
import Shape from './Shape';

export default class CircleShape extends Shape {
    constructor(x: number, y: number, color: number, radius: number, app: TestApp) {
        super(x, y, app, { color, radius });
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {
        graphics.drawCircle(0, 0, drawOptions.radius);
        graphics.endFill();
    }

}