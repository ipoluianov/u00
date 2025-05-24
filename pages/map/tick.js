APP.draw = function (elId) {
    drawAppTextWithHeader(APP);
}

APP.tick = function () {
    /*const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let timeString = `${hours}:${minutes}:${seconds}`;*/

    var comment = "";

    if ("wakeLock" in navigator) {
        comment = "Wake lock is supported by this browser.";
    } else {
        comment = "Wake lock is NOT supported by this browser.";
    }

    // parse json data
    if (APP.data_value === undefined) {
        APP.data = { Header: "Temperature", Value2: "NO DATA", Comment: comment };
        return;
    }

    var obj = JSON.parse(APP.data_value)


    APP.data = { Header: obj.d, Value2: obj.v, Comment: comment };
}
