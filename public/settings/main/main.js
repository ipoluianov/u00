const settingsElement = document.getElementById('settings');
settingsElement.style.backgroundColor = '#244';
settingsElement.style.height = '64px';
settingsElement.style.display = 'none';

this.btnSettings = function () {
    if (settingsElement.style.display === 'none') {
        loadSettings();
    } else {
        hideSettings();
    }
}

function hideSettings() {
    settingsElement.style.display = 'none';
    adjustSizes();
}

function loadSettings() {
    settingsElement.style.display = 'block';
    adjustSizes();
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
