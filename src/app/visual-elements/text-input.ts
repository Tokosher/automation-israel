import {
    Container,
} from 'pixi.js';
import {TextInputConfig} from "../element-config/text-input-config";
const textInput = require('pixi-text-input');

export class TextInput extends Container {
    private textInputElement: typeof textInput;

    constructor (config: TextInputConfig) {
        super();
        const { x, y } = config;
        x && (this.x = x);
        y && (this.y = y);

        this.textInputElement = new textInput(config);
        this.addChild(this.textInputElement);
    }

    get text(){
        return this.textInputElement.text
    }
}