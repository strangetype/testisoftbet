import './style.scss';
import { utils } from 'pixi.js';

import TestApp from './classes/TestApp';

utils.skipHello();

const app = new TestApp({
    view: document.getElementById('app') as HTMLCanvasElement,
    backgroundColor: 0xffffff,
    antialias: true,
    preserveDrawingBuffer: true
});

document.body.style.visibility = 'visible';