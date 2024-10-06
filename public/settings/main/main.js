const settingsElement = document.getElementById('settings');
settingsElement.style.display = 'none';
window.sSettingsHeight = 0;

this.btnSettings = function () {
    if (settingsElement.style.display === 'none') {
        loadSettings();
    } else {
        hideSettings();
    }
}

function hideSettings() {
    this.sSettingsHeight = 0;
    settingsElement.style.display = 'none';
    adjustSizes();
}

function loadSettings() {
    this.sSettingsHeight = 200;
    settingsElement.style.minHeight = '200px';
    settingsElement.style.maxHeight = '200px';
    settingsElement.style.height = '200px';

    console.log('loadSettings');
    settingsElement.style.display = 'block';
    if (this.OnSettings) {
        console.log('loadSettings1');
        this.OnSettings();
    }
    adjustSizes();
}

function SettingsSetColor(color) {
    localStorage.setItem('settingsColor', color);
    if (this.OnUpdateContent) this.OnUpdateContent();
}

this.OnSettings = function () {
    const settings = document.getElementById('settings');
    settings.innerHTML = `
<div>
    <div style="padding-left: 12px; padding-right: 12px;">COLOR:</div>
    <div style="display: flex; flex-direction: row; align-items: center;" >
        <button style="background-color: #FFFFFF" class="select-color-button" onclick="SettingsSetColor('#FFFFFF')"></button>
        <button style="background-color: #888888" class="select-color-button" onclick="SettingsSetColor('#888888')"></button>
        <button style="background-color: #000000" class="select-color-button" onclick="SettingsSetColor('#000000')"></button>
        <button style="background-color: #1E90FF" class="select-color-button" onclick="SettingsSetColor('#1E90FF')"></button>
        <button style="background-color: #00BFFF" class="select-color-button" onclick="SettingsSetColor('#00BFFF')"></button>
    </div>
    <div style="display: flex; flex-direction: row; align-items: center;" >
        <button style="background-color: #8A2BE2" class="select-color-button" onclick="SettingsSetColor('#8A2BE2')"></button>
        <button style="background-color: #3EB489" class="select-color-button" onclick="SettingsSetColor('#3EB489')"></button>
        <button style="background-color: #4CAF50" class="select-color-button" onclick="SettingsSetColor('#4CAF50')"></button>
        <button style="background-color: #FF9800" class="select-color-button" onclick="SettingsSetColor('#FF9800')"></button>
        <button style="background-color: #FFEB3B" class="select-color-button" onclick="SettingsSetColor('#FFEB3B')"></button>
    </div>
</div>
`;
}
