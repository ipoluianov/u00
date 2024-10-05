function getAttributeFromElement(element, attributeName) {
    if (element && attributeName) {
        return element.getAttribute(attributeName);
    }
    return null;
}

let appsToDraw = [];

function runApp() {
    const widgets = document.querySelectorAll('.widget');
    console.log(widgets);
    appsToDraw = [];
    widgets.forEach(element => {
        console.log("INIT APPID:", getAttributeFromElement(element, 'app-id'));
        appsToDraw.push(getAttributeFromElement(element, 'app-id'));
    });
}

function appDraw() {
    appsToDraw.forEach(appId => {
        let app = window[appId];
        if (app !== null && app !== undefined) {
            //console.log("APP:", app);
            app.tick();
            app.draw(appId);
        }
    });
}

/////////////////////////////////////////////

function drawAppText(app) {
    const canvas = document.getElementById(app.id + "_cnv");
    let width = canvas.width;
    let height = canvas.height;

    const ctx = canvas.getContext('2d');
    fillRect(ctx, 0, 0, width, height, window.sBackColor());

    let text = "";
    text = app.data;
    let paddingX = width / 10;
    let paddingY = height / 10;

    fontFamily = window.sFontFamily();
    fitTextToRectangle(ctx, text, paddingX, paddingY, width - paddingX*2, height-paddingY * 2, window.sColor(), 500)
}

function drawAppTextWithHeader(app) {
    const canvas = document.getElementById(app.id + "_cnv");
    let width = canvas.width;
    let height = canvas.height;

    this.fontFamily = window.sFontFamily();

    const ctx = canvas.getContext('2d');
    fillRect(ctx, 0, 0, width, height, window.sBackColor());

    let area1Height = height * 0.2;
    let area2Height = height - area1Height - 10;
    let area3Height = 10;

    let area1Offset = 0;
    let area2Offset = area1Offset + area1Height;
    let area3Offset = area2Offset + area2Height;

    let data = app.data;

    fitTextToRectangle(ctx, data.Value1, 0, area1Offset, width, area1Height, window.sColor(), 500)
    fitTextToRectangle(ctx, data.Value2, 0, area2Offset, width, area2Height, window.sColor(), 500)
    fitTextToRectangle(ctx, data.Comment, 0, area3Offset, width, area3Height, window.sColor(), 500)
}


function fillRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

/*function fitTextToRectangle(ctx, text, x, y, width, height, color, maxFontSize) {
    ctx.fillStyle = color;
    let fontSize = maxFontSize;
    ctx.font = fontSize + "px " + "Arial";
    while (ctx.measureText(text).width > width) {
        fontSize -= 1;
        ctx.font = fontSize + "px " + "Arial";
    }
    ctx.fillText(text, x, y + fontSize);
}*/

function fitTextToRectangle(ctx, text, x, y, width, height, color, maxFontSize) {
    ctx.fillStyle = color;
    let fontSize = maxFontSize;
    ctx.font = fontSize + "px " + "Arial";
    let textWidth = ctx.measureText(text).width;
    let metrics = ctx.measureText(text);
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    while ((textWidth > width || textHeight > height) && fontSize > 0) {
        fontSize -= 5;
        ctx.font = fontSize + "px " + "Arial";
        textWidth = ctx.measureText(text).width;
        metrics = ctx.measureText(text);
        textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    const centerY = y + (height / 2) + (textHeight / 2);
    ctx.fillText(text, x + (width - textWidth) / 2, centerY);
}
