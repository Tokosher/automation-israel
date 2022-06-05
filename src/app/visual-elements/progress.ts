import * as PIXI from "pixi.js"
import {ProgressConfig} from "../element-config/progress-config";
import {ProgressBar} from "progressbar.js"
import { ease } from 'pixi-ease'

export class ProgressElement extends PIXI.Container {
    config: ProgressConfig;
    progressLine: PIXI.Graphics;
    startWidth: number;

    constructor(config: ProgressConfig) {
        super();
        this.x = config.x || 0;
        this.y = config.y || 0;

        this.config = {
            thickness: config.thickness || 10,
            width: config.width || 100,
            color: config.color || 0xe7bc51,
        }

    }

    showProgressLine (cb: () => void) {
        this.progressLine = new PIXI.Graphics();
        this.addChild(this.progressLine);

        const percentOfLoading = this.config.width / 40;
        this.progressLine.lineStyle(this.config.thickness, this.config.color)
            .lineTo(percentOfLoading, 0);
        this.addChild(this.progressLine);
        this.startWidth = this.progressLine.width;

        ease.add(this.progressLine, { width: percentOfLoading * 20}, { duration: 1500 })
            .on('complete', () => {
                ease.add(this.progressLine, { width: percentOfLoading * 50}, { duration: 1000 })
                    .on('complete', () => {
                        ease.add(this.progressLine, { width: percentOfLoading * 70}, { duration: 1500 })
                            .on('complete', () => {
                                ease.add(this.progressLine, { width: percentOfLoading * 100}, { duration: 700 })
                                    .on('complete', () => {
                                        cb();
                                        this.removeChild(this.progressLine);
                                    })
                            })
                    })
            })
    }

    // resetElement () {
    //     this.progressLine.visible = false;
    // }
}