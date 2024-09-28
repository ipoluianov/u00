import { AppBase } from './app.js';

export class TextWithHeader extends AppBase {
    constructor() {
        super();
    }

    draw() {
        this.fontFamily = window.sFontFamily();

        this.fillRect(0, 0, this.width, this.height, window.sBackColor());

        let area1Height = this.height * 0.2;
        let area2Height = this.height - area1Height - 10;
        let area3Height = 10;

        let area1Offset = 0;
        let area2Offset = area1Offset + area1Height;
        let area3Offset = area2Offset + area2Height;

        this.fitTextToRectangle(this.data.Value1, 0, area1Offset, this.width, area1Height, window.sColor(), 500)
        this.fitTextToRectangle(this.data.Value2, 0, area2Offset, this.width, area2Height, window.sColor(), 500)
        this.fitTextToRectangle(this.data.Comment, 0, area3Offset, this.width, area3Height, window.sColor(), 500)
    }
}
