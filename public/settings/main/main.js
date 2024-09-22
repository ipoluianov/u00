console.log("SETTINGS MAIN JS");
const settingsElement = document.getElementById('settings');
settingsElement.style.backgroundColor = '#244';
settingsElement.style.height = '64px';
settingsElement.style.display = 'none';

this.btnSettings = function () {
    console.log("SETTINGS BUTTON");
    if (settingsElement.style.display === 'none') {
        loadSettings();
    } else {
        hideSettings();
    }
}

function hideSettings() {
    console.log("HIDE SETTINGS");
    settingsElement.style.display = 'none';
}

function loadSettings() {
    console.log("LOAD SETTINGS");
    settingsElement.style.display = 'block';
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
}