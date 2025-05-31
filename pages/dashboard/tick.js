APP.draw = function (elId) {
    drawAppTextWithHeader(APP);
}

APP.wakeLocked = false;
APP.wakeLockObject = null;

APP.wakeLock = async function () {
    if (APP.wakeLocked) {
        console.log('Wake Lock is already active');
        return;
    }
    try {
        APP.wakeLockObject = await navigator.wakeLock.request('screen');
        APP.wakeLockObject.addEventListener('release', () => {
            console.log('Screen Wake Lock was released');
        });
        console.log('Screen Wake Lock is active');
        APP.wakeLocked = true;
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

APP.tick = function () {
    var comment = "";

    if (APP.data_value === undefined) {
        APP.data = { Header: "DASHBOARD", Value2: "NO DATA", Comment: comment };
        return;
    }

    var obj = JSON.parse(APP.data_value)


    APP.data = { Header: obj.d, Value2: obj.v, Comment: comment };
}
