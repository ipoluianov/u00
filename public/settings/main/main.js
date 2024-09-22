const settingsElement = document.getElementById('settings');
settingsElement.style.backgroundColor = '#222';
settingsElement.style.topBottom = '1px solid #444';
settingsElement.style.borderBottom = '1px solid #444';
settingsElement.style.minHeight = '64px';
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
    console.log('loadSettings');
    settingsElement.style.display = 'block';
    if (this.OnSettings) {
        console.log('loadSettings1');
        this.OnSettings();
    }
    adjustSizes();
}

function SettingsColorSetWhite() {
    setCookie('settingsColor', '#FFF', 365);
    if (this.OnUpdateContent) this.OnUpdateContent();
}

function SettingsColorSetGreen() {
    setCookie('settingsColor', '#0F5', 365);
    if (this.OnUpdateContent) this.OnUpdateContent();
}

function SettingsColorSetRed() {
    setCookie('settingsColor', '#F24', 365);
    if (this.OnUpdateContent) this.OnUpdateContent();
}

function SettingsSetColor(color) {
    setCookie('settingsColor', color, 365);
    if (this.OnUpdateContent) this.OnUpdateContent();
}

this.OnSettings = function () {
    const settings = document.getElementById('settings');
    settings.innerHTML = `
<div style="display: flex; flex-direction: row; align-items: center;" >
    <div style="padding-left: 12px; padding-right: 12px; color: #aaa;">COLOR:</div>
    <button style="background-color: #EEE" class="select-color-button" onclick="SettingsSetColor('#EEE')"></button>
    <button style="background-color: #1E90FF" class="select-color-button" onclick="SettingsSetColor('#1E90FF')"></button>
    <button style="background-color: #00BFFF" class="select-color-button" onclick="SettingsSetColor('#00BFFF')"></button>
    <button style="background-color: #8A2BE2" class="select-color-button" onclick="SettingsSetColor('#8A2BE2')"></button>
    <button style="background-color: #3EB489" class="select-color-button" onclick="SettingsSetColor('#3EB489')"></button>
    <button style="background-color: #4CAF50" class="select-color-button" onclick="SettingsSetColor('#4CAF50')"></button>
    <button style="background-color: #FF9800" class="select-color-button" onclick="SettingsSetColor('#FF9800')"></button>
    <button style="background-color: #FFEB3B" class="select-color-button" onclick="SettingsSetColor('#FFEB3B')"></button>
</div>
`;
}
