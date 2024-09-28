export class AppBase {
    constructor() {
        this.ctx = null;
        this.fontFamily = 'Consolas';
        this.lastDrawTime = Date.now();

        this.width = 1;
        this.height = 1;
        this.dataStr = "";
        this.data = {}

        this.deltaTime = 1;
        window.adjustSizes();
    }

    tick() { }

    drawBase(currentDataStr) {
        //////////////////////////////////////////////////
        const currentTimeInMs = Date.now();
        this.deltaTime = Math.abs(this.lastDrawTime - currentTimeInMs)
        this.lastDrawTime = currentTimeInMs;
        //////////////////////////////////////////////////

        const canvas = document.getElementById('cnv');
        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.dataStr = currentDataStr;

        if (this.dataStr != "" && this.dataStr != undefined) {
            this.data = JSON.parse(this.dataStr);
        } else {
            this.data = {}
        }

        this.tick();
        this.draw();
    }

    drawRect(x, y, width, height, strokeWidth, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = strokeWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    fillRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawText(text, x, y, fontSize, color) {
        this.ctx.font = fontSize + "px " + this.fontFamily;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    fitTextToRectangle(text, x, y, width, height, color, maxFontSize) {
        this.ctx.fillStyle = color;
        let fontSize = maxFontSize;
        this.ctx.font = fontSize + "px " + this.fontFamily;
        let textWidth = this.ctx.measureText(text).width;
        let metrics = this.ctx.measureText(text);
        let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        while ((textWidth > width || textHeight > height) && fontSize > 0) {
            fontSize -= 1;
            this.ctx.font = fontSize + "px " + this.fontFamily;
            textWidth = this.ctx.measureText(text).width;
            metrics = this.ctx.measureText(text);
            textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        }

        const centerY = y + (height / 2) + (textHeight / 2);
        this.ctx.fillText(text, x + (width - textWidth) / 2, centerY);
    }

    drawSegment(ctx, x, y, w, h, thickness, segment) {
        ctx.beginPath();
        // Рисуем горизонтальные сегменты
        if (w > h) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.closePath();
        }
        // Рисуем вертикальные сегменты
        else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.closePath();
        }

        if (segment) {
            ctx.fill();
        } else {
            //ctx.stroke();
        }
    }

    drawSevenSegment(ctx, x, y, w, h, digit) {
        const thickness = Math.min(w, h) * 0.1; // Толщина сегмента
        ctx.lineWidth = 2;

        // Сегменты: [top, top-right, bottom-right, bottom, bottom-left, top-left, middle]
        const segments = {
            "0": [true, true, true, true, true, true, false],
            "1": [false, true, true, false, false, false, false],
            "2": [true, true, false, true, true, false, true],
            "3": [true, true, true, true, false, false, true],
            "4": [false, true, true, false, false, true, true],
            "5": [true, false, true, true, false, true, true],
            "6": [true, false, true, true, true, true, true],
            "7": [true, true, true, false, false, false, false],
            "8": [true, true, true, true, true, true, true],
            "9": [true, true, true, true, false, true, true]
        };

        const segState = segments[digit];

        // Top
        this.drawSegment(ctx, x + thickness, y, w - 2 * thickness, thickness, thickness, segState[0]);

        // Top-right
        this.drawSegment(ctx, x + w - thickness, y + thickness, thickness, h / 2 - thickness, thickness, segState[1]);

        // Bottom-right
        this.drawSegment(ctx, x + w - thickness, y + h / 2, thickness, h / 2 - thickness, thickness, segState[2]);

        // Bottom
        this.drawSegment(ctx, x + thickness, y + h - thickness, w - 2 * thickness, thickness, thickness, segState[3]);

        // Bottom-left
        this.drawSegment(ctx, x, y + h / 2, thickness, h / 2 - thickness, thickness, segState[4]);

        // Top-left
        this.drawSegment(ctx, x, y + thickness, thickness, h / 2 - thickness, thickness, segState[5]);

        // Middle
        this.drawSegment(ctx, x + thickness, y + h / 2 - thickness / 2, w - 2 * thickness, thickness, thickness, segState[6]);
    }

    drawDigit(ctx, x, y, w, h, digit) {
        w = w - w * 0.2;
        if (digit === ".") {
            // Рисуем точку отдельно
            ctx.beginPath();
            const radius = Math.min(w, h) * 0.1; // Радиус точки
            ctx.arc(x + w / 2, y + h - radius, radius, 0, 2 * Math.PI);
            ctx.fill();
        } else if (digit >= "0" && digit <= "9") {
            this.drawSevenSegment(ctx, x, y, w, h, digit);
        }
    }

    drawSevenSegmentText(ctx, text, x, y, width, height) {
        const charWidth = width / text.length;

        ctx.strokeStyle = "green"; // Цвет обводки
        ctx.fillStyle = "green"; // Цвет заливки сегментов

        for (let i = 0; i < text.length; i++) {
            this.drawDigit(ctx, x + i * charWidth, y, charWidth, height, text[i]);
        }
    }
}
