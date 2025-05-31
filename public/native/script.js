console.log("native script loaded");

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

async function updateItemValue(itemId) {
    var result = "";
    try {
        var response = await fetch(`https://map.u00.io/get/${itemId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        result = await response.text();
    } catch (error) {
        console.error("Error fetching item value:", error);
    }
    return result;
}

function formatSignature(signature) {
    if (signature.startsWith("0x")) {
        signature = signature.slice(2);
    }
    if (signature.length !== 128) {
        return "";
    }
    return `${signature.slice(0, 16)}\r\n${signature.slice(16, 32)}\r\n${signature.slice(32, 48)}\r\n${signature.slice(48, 64)}`;
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

    var itemDisplayName = ""
    var itemDisplayNameElement = document.getElementById("itemDisplayName");

    var itemValue = ""
    var itemValueElement = document.getElementById("itemValue");

    var itemDateTime = "";
    var itemDateTimeElement = document.getElementById("itemDateTime");

    var itemSignature = "";
    var itemSignatureFormatted = "";
    var itemSignatureElement = document.getElementById("itemSignature");

    valueFromServer = await updateItemValue(itemAddress);
    if (valueFromServer != "") {
        var jsonValue = await JSON.parse(valueFromServer);
        itemValue = jsonValue.v;

        itemDisplayName = jsonValue.d;
        itemDateTime = jsonValue.t;
        itemSignature = jsonValue.s;
        itemSignatureFormatted = formatSignature(itemSignature);
    } else {
        itemValue = "No data found";
        itemDisplayName = "No dispay name";
        itemDateTime = "-";
        itemSignatureFormatted = "No signature";
    }

    itemAddressElement.textContent = formatItemAddress(itemAddress);

    itemValueElement.textContent = itemValue;
    itemDisplayNameElement.textContent = itemDisplayName;
    itemDateTimeElement.textContent = itemDateTime;
    itemSignatureElement.textContent = itemSignatureFormatted;

    var itemLastUpdateTimeElement = document.getElementById("itemLastUpdateTime");
    var currentTime = new Date();
    // Format YYYY-MM-DD HH:MM:SS
    var lastUpdateTimeFormartted = currentTime.toISOString().replace('T', ' ').substring(0, 19);
    itemLastUpdateTimeElement.textContent = lastUpdateTimeFormartted;

    updating = false;
}

setInterval(() => { updateItem(); }, 1000);
