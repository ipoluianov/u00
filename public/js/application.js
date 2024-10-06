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
    fitTextToRectangle(ctx, text, paddingX, paddingY, width - paddingX * 2, height - paddingY * 2, window.sColor(), 500)
}

function drawAppTextWithHeader(app) {
    const canvas = document.getElementById(app.id + "_cnv");
    let width = canvas.width;
    let height = canvas.height;

    this.fontFamily = window.sFontFamily();

    const ctx = canvas.getContext('2d');
    fillRect(ctx, 0, 0, width, height, window.sBackColor());

    let paddingX = width / 10;
    let paddingY = height / 10;

    let heightWithoutPadding = height - paddingY * 2;

    let area0Height = heightWithoutPadding * 0.2;
    let area1Height = heightWithoutPadding * 0.3;
    let area2Height = heightWithoutPadding * 0.45;
    let area3Height = heightWithoutPadding * 0.05;

    let area0Offset = paddingY;
    let area1Offset = area0Offset + area0Height;
    let area2Offset = area1Offset + area1Height;
    let area3Offset = area2Offset + area2Height;

    let data = app.data;

    if (data.Header != null && data.Header != "") {
        fitTextToRectangle(ctx, data.Header, paddingX, area0Offset, width - paddingX * 2, area0Height, window.sColor(), 500)
    }
    if (data.Value1 != null && data.Value1 != "") {
        fitTextToRectangle(ctx, data.Value1, paddingX, area1Offset, width - paddingX * 2, area1Height, window.sColor(), 500)
    }
    if (data.Value2 != null && data.Value2 != "") {
        fitTextToRectangle(ctx, data.Value2, paddingX, area2Offset, width - paddingX * 2, area2Height, window.sColor(), 500)
    }
    if (data.Comment != null && data.Comment != "") {
        fitTextToRectangle(ctx, data.Comment, paddingX, area3Offset, width - paddingX * 2, area3Height, window.sColor(), 500)
    }
}

function drawRect(ctx, x, y, width, height, strokeWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(x, y, width, height);
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

    let paddingX = width * 0.02;
    let paddingY = height * 0.05;

    let tX = x + paddingX;
    let tY = y + paddingY;
    let tWidth = width - paddingX * 2;
    let tHeight = height - paddingY * 2;

    ctx.fillStyle = color;
    let fontSize = maxFontSize;
    ctx.font = fontSize + "px " + window.sFontFamily();
    let textWidth = ctx.measureText(text).width;
    let metrics = ctx.measureText(text);
    let textHeight = 0;
    textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    while ((textWidth > tWidth || textHeight > tHeight) && fontSize > 0) {
        fontSize -= 5;
        ctx.font = fontSize + "px " + window.sFontFamily();
        textWidth = ctx.measureText(text).width;
        metrics = ctx.measureText(text);
        textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    const centerY = tY + (tHeight / 2) + (textHeight / 2);
    ctx.fillText(text, tX + (tWidth - textWidth) / 2, centerY - metrics.actualBoundingBoxDescent);

    // drawRect(ctx, x, y, width, height, 1, color);
}
