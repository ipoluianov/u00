
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
    // function returns byte array
    var result = {};
    try {
        var response = await fetch(`https://map.u00.io/get/${itemId}`);
        if (!response.ok) {
            return result;
        }
        /*result = await response.bytes();*/
        

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


    var valueFromServer = await updateItemValue(itemAddress);

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
