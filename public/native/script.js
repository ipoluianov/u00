
function getItemIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    if (urlParts.length < 2) {
        console.error("Invalid URL format. Expected format: /native/id");
        return null;
    }
    if (urlParts[1] === "native") {
        return urlParts[2]; // Return the item ID from the URL
    }
    console.error("URL does not match expected format: /native/id");
    return null;
}

async function updateItemValue(itemId, domain) {
    // function returns byte array

    if (itemId === null || itemId === undefined) {
        console.error("Item ID is null or undefined.");
        return null;
    }

    if (itemId.length !== 66 || !itemId.startsWith("0x")) {
        console.error("Invalid item ID format. Expected format: 0x followed by 64 hex characters.");
        return null;
    }

    /*var domain = itemId.slice(2, 3);
    console.log("Domain:", domain);*/

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);


    var result = {};
    try {
        var response = await fetch(`https://s${domain}.u00.io/get/${itemId}`, {
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!response.ok) {
            return result;
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        for (const filename of Object.keys(zip.files)) {
            const file = zip.files[filename];
            if (!file.dir) {
                if (filename === "time") {
                    const content = await file.async("string");
                    result.t = content;
                }
                if (filename === "value") {
                    const content = await file.async("string");
                    result.v = content;
                }
                if (filename === "name") {
                    const content = await file.async("string");
                    result.d = content;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching item value:", error);
        result = null;
    }
    return result;
}

function formatItemAddress(itemAddress) {
    // 0x1234....5678
    if (itemAddress.startsWith("0x")) {
        itemAddress = itemAddress.slice(2);
    }
    if (itemAddress.length !== 64) {
        return "";
    }
    return `0x${itemAddress.slice(0, 4)}...${itemAddress.slice(-4)}`;
}

var updating = false;

async function updateItem() {
    if (updating) {
        console.warn("Update already in progress. Skipping this update.");
        return;
    }
    updating = true;

    var itemAddress = getItemIdFromUrl();
    var itemAddressElement = document.getElementById("itemAddress");

    var itemAddress = getItemIdFromUrl();
    var itemAddressElement = document.getElementById("itemAddress");

    var itemDisplayName = ""
    var itemDisplayNameElement = document.getElementById("titleElement");

    var itemValue = ""
    var itemValueElement = document.getElementById("itemValue");

    var itemDateTime = "";
    var itemDateTimeElement = document.getElementById("itemDateTime");

    var domain1 = itemAddress.slice(2, 3);
    var domain2 = domain1
    // domain2 = 0->1 ... 9->a ..... f->0
    if (domain1 === "0") {
        domain2 = "1";
    }
    if (domain1 === "1") {
        domain2 = "2";
    }
    if (domain1 === "2") {
        domain2 = "3";
    }
    if (domain1 === "3") {
        domain2 = "4";
    }
    if (domain1 === "4") {
        domain2 = "5";
    }
    if (domain1 === "5") {
        domain2 = "6";
    }
    if (domain1 === "6") {
        domain2 = "7";
    }
    if (domain1 === "7") {
        domain2 = "8";
    }
    if (domain1 === "8") {
        domain2 = "9";
    }
    if (domain1 === "9") {
        domain2 = "a";
    }
    if (domain1 === "a") {
        domain2 = "b";
    }
    if (domain1 === "b") {
        domain2 = "c";
    }
    if (domain1 === "c") {
        domain2 = "d";
    }
    if (domain1 === "d") {
        domain2 = "e";
    }
    if (domain1 === "e") {
        domain2 = "f";
    }
    if (domain1 === "f") {
        domain2 = "0";
    }

    var valueFromServer1 = await updateItemValue(itemAddress, domain1);
    var valueFromServer2 = await updateItemValue(itemAddress, domain2);
    var valueFromServer = null;
    if (valueFromServer1 != null && valueFromServer1 != undefined) {
        valueFromServer = valueFromServer1;
    }
    if (valueFromServer2 != null && valueFromServer2 != undefined) {
        valueFromServer = valueFromServer2;
    }

    if (valueFromServer != null && valueFromServer != undefined) {
        var jsonValue = valueFromServer;
        itemValue = jsonValue.v;

        itemDisplayName = jsonValue.d;
        itemDateTime = jsonValue.t;
    } else {
        itemValue = "No data found";
        itemDisplayName = "No dispay name";
        itemDateTime = "-";
    }

    itemAddressElement.textContent = formatItemAddress(itemAddress);

    itemValueElement.textContent = itemValue;
    itemDisplayNameElement.textContent = itemDisplayName;
    itemDateTimeElement.textContent = itemDateTime;

    var itemLastUpdateTimeElement = document.getElementById("itemLastUpdateTime");
    var currentTime = new Date();
    // Format YYYY-MM-DD HH:MM:SS
    var lastUpdateTimeFormartted = currentTime.toISOString().replace('T', ' ').substring(0, 19);
    itemLastUpdateTimeElement.textContent = lastUpdateTimeFormartted;

    updating = false;
}

setInterval(() => { updateItem(); }, 1000);
updateItem();
