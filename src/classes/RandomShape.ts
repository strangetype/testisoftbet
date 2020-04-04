import { Graphics, SCALE_MODES } from 'pixi.js';
import TestApp from './TestApp';
import Shape from './Shape';
import * as isOdd from 'is-odd';

export default class RandomShape extends Shape {
    constructor(x: number, y: number, color: number, size: number, app: TestApp) {
        super(x, y, app, { color, size });
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {
        const points = 3+Math.round(Math.random()*8);
        let da = 0, s = drawOptions.size*(Math.random()*.8 + .2);
        let firstPoint = [s*Math.cos(da), s*Math.sin(da)];
        graphics.moveTo(firstPoint[0], firstPoint[1]);
        for (let i=0; i<points; i++) {
            da += Math.random()*4*Math.PI/points;
            if (da > 2*Math.PI) da = 2*Math.PI;
            s = drawOptions.size*(Math.random()*.8 + .2);
            graphics.lineTo(s*Math.cos(da), s*Math.sin(da));
        }
        graphics.lineTo(firstPoint[0], firstPoint[1]);
        graphics.endFill();
    }

}