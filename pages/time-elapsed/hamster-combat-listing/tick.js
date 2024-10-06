
APP.draw = function (elId) {
    drawAppTextWithHeader(APP);
}

APP.tick = function () {
    let name = "Hamster Combat Listing";
    let comment = "until 2024-09-26 12:00:00 UTC"
    let value = timeUntilUTCDateTime("2024-09-26T12:00:00Z");
    let parts = value.split("days")
    let v1 = parts[0] + " days";
    let v2 = parts[1];
    if (parts.length < 2) {
        v1 = value
        v2 = ""
    }
    APP.data = { Header: name, Value1: v1, Value2: v2.trim(), Comment: comment };
}

function timeUntilUTCDateTime(targetDateTimeUTC) {
    const targetDate = new Date(targetDateTimeUTC);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    const isPast = diff < 0;

    const absDiff = Math.abs(diff);

    const days = String(Math.floor(absDiff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((absDiff % (1000 * 60)) / 1000)).padStart(2, '0');

    return `${days} days ${hours}:${minutes}:${seconds}`;
}
