import {
    Container
} from 'pixi.js';

export class ScreenFactory {
    private stage: Container;
    private screens: Object = {};
    private screenHistory: string[] = [];

    constructor (stage: Container) {
        this.stage = stage;
    }

    public showScreen (name: string, elements?: Array<any>) {
        this.stage.removeChildren();
        if (this.screenHistory.includes(name)) {
            this.screenHistory.splice(this.screenHistory.indexOf(name) + 1)
        } else {
            this.screenHistory.push(name);
        }
        this.screenHistory.push(name);
        if (elements) {
            this.screens[name] = elements;
            elements.forEach(e => this.stage.addChild(e));
            return
        }

        this.screens[name].forEach(e => {
            this.stage.addChild(e);
        })
    }
}