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

async function updateItemName(itemId, itemNameElement) {
    var valueFromServer = await updateItemValue(itemId);
    var jsonValue = await JSON.parse(valueFromServer);
    var itemValue = jsonValue.d;
    try {
        var el = document.getElementById(itemNameElement).innerText = itemValue;
        el.innerHTML = itemValue;
    } catch (error) {

    }
}

async function loadItems() {
    const response = await fetch("https://map.u00.io/get-addresses");
    if (!response.ok) {
        console.error("Failed to load items:", response.statusText);
        return;
    }
    const items = await response.json();
    const itemsList = document.getElementById("listOfItems");
    itemsList.innerHTML = ""; // Clear existing items
    items.forEach(id => {
        // <div><a href="/native/{id}"></s></div>
        var formattedItemAddress = formatItemAddress(id);
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
        <a href="/native/${id}">
            <div style='border: 1px solid #ccc;'>
                <div id='itemName_${id}'></div>
                <div style='color: #808080; font-size: 0.7em;'>${formattedItemAddress}</div>
            </div>
        </a>`;
        itemsList.appendChild(itemDiv);
        updateItemName(id, `itemName_${id}`);
    }
    );
    console.log("Items loaded:", items);
}

loadItems();
