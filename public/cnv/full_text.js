import { AppBase } from './app.js';

export class FullText extends AppBase {
    constructor(elId) {
        super(elId);
    }

    draw() {
        this.fillRect(0, 0, this.width, this.height, window.sBackColor());

        let text = "";
        text = this.data;
        let paddingX = this.width / 10;
        let paddingY = this.height / 10;

        this.fontFamily = window.sFontFamily();
        this.fitTextToRectangle(text, paddingX, paddingY, this.width - paddingX*2, this.height-paddingY * 2, window.sColor(), 500)
    }
}
