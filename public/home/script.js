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

async function loadItems(domain) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000);

        // set timeout to 1 second
        const response = await fetch("https://s" + domain + ".u00.io/get-addresses",
            {
                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            console.error("Failed to load items:", response.statusText);
            return;
        }
        const items = await response.json();
        const itemsList = document.getElementById("listOfItems");
        //itemsList.innerHTML = ""; // Clear existing items
        items.forEach(id => {
            // <div><a href="/native/{id}"></s></div>
            var formattedItemAddress = formatItemAddress(id);
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = `
        <div>Domain: ${domain}</div>
        <a href="/native/${id}">
            <div style='border: 1px solid #ccc;'>
                <div id='itemName_${id}'></div>
                <div style='color: #808080; font-size: 0.7em;'>${formattedItemAddress}</div>
            </div>
        </a>`;
            itemsList.appendChild(itemDiv);
        }
        );
        //console.log("Items loaded:", items);
        await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

async function loadAllDomains() {
    await loadItems("0");
    await loadItems("1");
    await loadItems("2");
    await loadItems("3");
    await loadItems("4");
    await loadItems("5");
    await loadItems("6");
    await loadItems("7");
    await loadItems("8");
    await loadItems("9");
    await loadItems("a");
    await loadItems("b");
    await loadItems("c");
    await loadItems("d");
    await loadItems("e");
    await loadItems("f");
}

loadAllDomains();
