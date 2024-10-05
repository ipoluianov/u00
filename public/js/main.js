function hello() {
    console.log("Hello")
}

function settingsGetColor() {
    return localStorage.getItem("settingsColor", "dark") || '#888888';
}

function sBackColor() {
    if (document.body.id == "lightThemeContainer") {
        return '#EEE';
    } else {
        return '#0F0F0F';
    }
}

function sColor() {
    return localStorage.getItem("settingsColor", "dark") || '#888888';
}

function sFontFamily() {   
    return 'Roboto Mono';
}

function btnInvertColors() {
    if (document.body.id == "lightThemeContainer") {
        document.body.id = "darkThemeContainer";
        localStorage.setItem("colorTheme", "dark");
    } else {
        document.body.id = "lightThemeContainer";
        localStorage.setItem("colorTheme", "light");
    }
}

function loadColorTheme() {
    const colorTheme = localStorage.getItem("colorTheme");
    if (colorTheme == "light") {
        document.body.id = "lightThemeContainer";
    } else {
        if (colorTheme == "dark") {
            document.body.id = "darkThemeContainer";
        } else {
            document.body.id = "darkThemeContainer";
        }
    }
}

function btnFullscreen() {
    const elem = document.getElementById("viewDiv");

    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
    adjustSizes();
}
