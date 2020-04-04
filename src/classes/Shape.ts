import { Application, Sprite, Graphics, Texture, SCALE_MODES, utils, BLEND_MODES, Filter } from 'pixi.js';
import TestApp from './TestApp';
import { FULL_DESTROY } from '../constants';

import * as highlightShader from '../shaders/highlight.txt';

const highlightFilter = new Filter(undefined, highlightShader.default);

export default class Shape extends Sprite {

    readonly app: TestApp;
    readonly ySize: number;

    constructor(x = 0, y = 0, app: TestApp, drawOptions: any) {
        super(null);
        this.app = app;
        this.init(drawOptions);
        this.interactive = true;
        this.x = x;
        this.y = y;
        this.on('pointertap', this.ontap, this);
        this.on('pointerover', this.highlight, this);
        this.on('pointerout', this.tarnish, this);
        this.rotation = 2*Math.PI*Math.random();
        this._calculateBounds();
        this.ySize = .5*this.getBounds().height;
        app.stage.addChild(this);
        app.ticker.add(this.update, this, 1);
    }

    private highlight() {
        this.filters = [highlightFilter];
    }

    private tarnish() {
        this.filters = [];
    }

    protected getGraphics(drawOptions: any) {
        return new Graphics().beginFill(drawOptions.color, 1).lineStyle(2, 0x444444, 1);
    }

    protected init(drawOptions: any) {
        const graphics = this.getGraphics(drawOptions);
        this.selfDraw(graphics, drawOptions);
        let geometry = graphics.geometry as any;
        let bounds = geometry.bounds;
        this.texture = this.app.renderer.generateTexture(graphics, SCALE_MODES.LINEAR, this.app.renderer.resolution);
        let b = this.getBounds();
        this.anchor.set(-bounds.minX/b.width, -bounds.minY/b.height);
        this.hitArea = geometry.graphicsData[0].shape;
        graphics.destroy(FULL_DESTROY);
    }

    protected selfDraw(graphics: Graphics, drawOptions: any) {

    }

    private ontap(ev: any) {
        ev.stopPropagation();
        this.destroy();
    }

    update() {
        this.y += this.app.gravity;
        if ((this.y < -this.ySize) || (this.y>this.app.renderer.height + this.ySize)) this.destroy();
    }

    destroy() {
        this.parent.removeChild(this);
        this.app.ticker.remove(this.update, this);
        super.destroy(FULL_DESTROY);
        this.removeAllListeners();
    }

}