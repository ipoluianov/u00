function hello() {
    console.log("Hello")
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function settingsGetColor() {
    return getCookie('settingsColor') || '#888888';
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
            document.body.id = "lightThemeContainer";
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
