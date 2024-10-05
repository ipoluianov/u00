
APP.draw = function (elId) {
    drawAppTextWithHeader(APP);
}

APP.tick = function () {
    let name = "Time until the end of 2024";
    let value = timeUntilDateTime("2025-01-01 00:00:00");
    let parts = value.split("days")
    let v1 = parts[0] + " days";
    let v2 = parts[1];
    if (parts.length < 2) {
        v1 = value
        v2 = ""
    }

    APP.data = { Name: name, Value1: v1, Value2: v2, Comment: "until 2025-01-01 00:00:00 (local time)" };
}

function timeUntilDateTime(targetDateTime) {
    const targetDate = new Date(targetDateTime);
    const now = new Date();
    if (now >= targetDate) {
        return "Time has already passed";
    }

    const diff = targetDate - now;
    const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    return `${days} days${hours}:${minutes}:${seconds}`;
}
