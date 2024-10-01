function getAttributeFromElement(element, attributeName) {
    if (element && attributeName) {
        return element.getAttribute(attributeName);
    }
    return null;
}

function runApp() {
    const widgets = document.querySelectorAll('.widget');
    console.log(widgets);
    widgets.forEach(element => {
        console.log(getAttributeFromElement(element, 'data-widget-id'));
    });
}
