APP.draw = function(elId) {
    drawAppTextWithHeader(APP);
}

APP.tick = function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let timeString = `${hours}:${minutes}:${seconds}`;

    const offsetMinutes = new Date().getTimezoneOffset();
    let offsetHours = -offsetMinutes / 60;
    
    let utcOffsetStr = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

    APP.data = {Header: "Current Time", Value2: timeString, Comment: utcOffsetStr};
}
