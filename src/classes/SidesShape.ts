import { Graphics, SCALE_MODES } from 'pixi.js';
import TestApp from './TestApp';
import Shape from './Shape';

export default class SidesShape extends Shape {
    constructor(x: number, y: number, color: number, size: number, points: number, app: TestApp) {
        super(x, y, app, { color, size, points });
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {
        const da = 2*Math.PI/drawOptions.points;
        graphics.moveTo(drawOptions.size*Math.cos(0), drawOptions.size*Math.sin(0));
        for (let i=0; i<drawOptions.points; i++) {
            graphics.lineTo(drawOptions.size*Math.cos(da*i), drawOptions.size*Math.sin(da*i));
        }
        graphics.lineTo(drawOptions.size*Math.cos(0), drawOptions.size*Math.sin(0));
        graphics.endFill();
    }

}