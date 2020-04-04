import { Application, Filter, Graphics, Sprite, SCALE_MODES } from "pixi.js";
import * as res from 'res';
import * as debounce from 'debounce';

import Shape from './Shape';
import CircleShape from './CircleShape';
import EllipseShape from './EllipseShape';
import SidesShape from './SidesShape';
import StarShape from './StarShape';
import RandomShape from './RandomShape';

export default class TestApp extends Application {

    private _gravity: number;

    get gravity(): number {
        return this._gravity;
    }
    set gravity(value: number) {
        this._gravity = value;
        if (this._gravity < 0) this._gravity = 0;
        this.gravityTag.innerText = this._gravity.toLocaleString();
    }

    private _birthFrequency: number;
    private birthTimerId: number;

    get birthFrequency(): number {
        return this._birthFrequency;
    }
    set birthFrequency(value: number) {
        this._birthFrequency = value;
        if (this._birthFrequency < 0) this._birthFrequency = 0;
        clearInterval(this.birthTimerId);
        this.birthFrequencyTag.innerText = this._birthFrequency.toLocaleString();
        if (!this._birthFrequency) return;
        this.birthTimerId = setInterval(() => {
            this.createShape();
        }, 1e3/this._birthFrequency);
    }

    private buffer: Uint8Array;
    private squareCalcWorker: Worker;
    private squareValueTag: HTMLElement;
    private shapesCountTag: HTMLElement;
    private gravityIncreaseButton: HTMLElement;
    private gravityDecreaseButton: HTMLElement;
    private gravityTag: HTMLElement;
    private birthFrequencyIncreaseButton: HTMLElement;
    private birthFrequencyDecreaseButton: HTMLElement;
    private birthFrequencyTag: HTMLElement;

    constructor(options: any) {

        const DPPX = res.dppx();

        const w = Math.min(document.body.offsetWidth, window.innerWidth);
        const h = Math.min(document.body.offsetHeight, window.innerHeight);

        options.width = w*DPPX;
        options.height = h*DPPX;

        super(options);

        let backgroundTexture = this.renderer.generateTexture(new Graphics().beginFill(0xffffff, 1).drawRect(0,0,2,2).endFill(), SCALE_MODES.LINEAR, this.renderer.resolution);
        let backgroundSprite = new Sprite(backgroundTexture);
        backgroundSprite.width = this.renderer.width;
        backgroundSprite.height = this.renderer.height;
        this.stage.addChild(backgroundSprite);

        window.addEventListener('resize', debounce(()=>this.onresize(), 256, false));

        this.view.style.width = w+'px';
        this.view.style.height = h+'px';

        this.stage.interactive = true;
        this.stage.on('pointertap', (e: any) => {
            this.createShape(e.data.global.x, e.data.global.y);
        });

        this.buffer = new Uint8Array(this.renderer.gl.drawingBufferWidth * this.renderer.gl.drawingBufferHeight * 4);
        this.squareCalcWorker = new Worker('assets/squareCalcWorker.js');
        this.squareValueTag = document.getElementById('squareValue');
        this.squareCalcWorker.onmessage = e => {
            this.squareValueTag.innerText = e.data.toLocaleString();
            this.calcOcupiedPixels();
        };

        this.shapesCountTag = document.getElementById('shapesCount');
        this.ticker.add(() => {
            this.shapesCountTag.innerText = (this.stage.children.length-1).toLocaleString();
        });

        this.gravityDecreaseButton = document.getElementById('gravityDecrease');
        this.gravityIncreaseButton = document.getElementById('gravityIncrease');
        this.gravityTag = document.getElementById('gravity');

        this.gravityDecreaseButton.addEventListener('click', ()=> {
            this.gravity--;
        });
        this.gravityIncreaseButton.addEventListener('click', ()=> {
            this.gravity++;
        });

        this.birthFrequencyDecreaseButton = document.getElementById('birthFrequencyDecrease');
        this.birthFrequencyIncreaseButton = document.getElementById('birthFrequencyIncrease');
        this.birthFrequencyTag = document.getElementById('birthFrequency');

        this.birthFrequencyDecreaseButton.addEventListener('click', ()=> {
            this.birthFrequency--;
        });
        this.birthFrequencyIncreaseButton.addEventListener('click', ()=> {
            this.birthFrequency++;
        });

        this.gravity = 1;
        this.birthFrequency = 1;

        this.calcOcupiedPixels();

    }

    createShape(x?: number, y?: number) {

        let type = Math.round(Math.random()*7);
        let radius = .025*this.renderer.width + .1*Math.random()*this.renderer.width;
        if (!isFinite(x)) x = Math.random()*this.renderer.width;

        let color = Math.round(Math.random()*0xfffffe);

        let shape: Shape;

        switch (type) {
            case 0: shape = new SidesShape(x, y, color, radius, 3, this); break;
            case 1: shape = new SidesShape(x, y, color, radius, 4, this); break;
            case 2: shape = new SidesShape(x, y, color, radius, 5, this); break;
            case 3: shape = new SidesShape(x, y, color, radius, 6, this); break;
            case 4: shape = new CircleShape(x, y, color, radius, this); break;
            case 5: shape = new EllipseShape(x, y, color, radius, this); break;
            case 6: shape = new StarShape(x, y, color, radius, 2+Math.round(Math.random()*8), this); break;
            case 7: shape = new RandomShape(x, y, color, radius, this); break;
        }

        if (!isFinite(y)) shape.y = -shape.ySize;
    }

    private onresize() {

        const DPPX = res.dppx();

        const w = Math.min(document.body.offsetWidth, window.innerWidth);
        const h = Math.min(document.body.offsetHeight, window.innerHeight);

        this.renderer.resize(w*DPPX, h*DPPX);

        this.view.style.width = w+'px';
        this.view.style.height = h+'px';

        this.buffer = new Uint8Array(this.renderer.gl.drawingBufferWidth * this.renderer.gl.drawingBufferHeight * 4);
    }

    private calcOcupiedPixels() {
        let gl = this.renderer.gl;
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, this.buffer);
        this.squareCalcWorker.postMessage(this.buffer);
    }

}