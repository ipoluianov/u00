import { AppBase } from './app.js';

export class PriceSimple extends AppBase {
    constructor() {
        super();
    }

    draw() {
        //console.log("PriceSimple.draw()");
        this.fillRect(0, 0, this.width, this.height, window.sBackColor());

        let text = "";
        text = this.data.Price1 + "." + this.data.Price2;
        let paddingX = this.width / 10;
        let paddingY = this.height / 10;

        this.fontFamily = window.sFontFamily();
        this.fitTextToRectangle(text, paddingX, paddingY, this.width - paddingX*2, this.height-paddingY * 2, window.sColor(), 500)
    }
}
