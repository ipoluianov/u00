
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
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `<a href="/native/${id}">${id}</a>`;
        itemsList.appendChild(itemDiv);
    }
    );
    console.log("Items loaded:", items);
}

loadItems();
