APP.draw = function(elId) {
    drawAppText(APP);
}

APP.tick = function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    APP.data = `${hours}:${minutes}:${seconds}`;
}
