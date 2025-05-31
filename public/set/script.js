
var publicKeyMain;
var privateKeyMain;

/*
type Item struct {
    Address     string `json:"a"`
    DisplayName string `json:"d"`
    DT          string `json:"t"`
    Value       string `json:"v"`
    Signature   string `json:"s"`
}
*/

const toHex = (buf) => [...buf].map(b => b.toString(16).padStart(2, '0')).join('');

var keyPair;

async function generateKey() {
    keyPair = nacl.sign.keyPair();

    const setJson = {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey
    };

    const message = new TextEncoder().encode("Hello world");

    const signature = nacl.sign.detached(message, keyPair.secretKey);
    const verified = nacl.sign.detached.verify(message, signature, keyPair.publicKey);

    ///const toHex = (buf) => [...buf].map(b => b.toString(16).padStart(2, '0')).join('');

    console.log(`
Public Key:
${toHex(keyPair.publicKey)}

Secret Key:
${toHex(keyPair.secretKey)}

Signature:
${toHex(signature)}

Verified: ${verified}
`.trim());

}

function setItemValueFromInput() {
    const value = document.getElementById("itemValue").value;
    if (value) {
        setItemValue(value);
    }
    else {
        console.error("Item value is empty. Please enter a value.");
    }
}

async function setItemValue(value) {
    console.log("Setting item value:", value);

    const addr = "0x" + toHex(keyPair.publicKey);

    const item = {
        a: addr,
        d: "Display Name",
        t: new Date().toISOString(),
        v: value,
        s: "0x" + toHex(nacl.sign.detached(new TextEncoder().encode(value), keyPair.secretKey))
    }

    console.log("Item to set:", item);
    itemAsString = JSON.stringify(item);
    var itemAsHexString = new TextEncoder().encode(itemAsString).reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '');

    const response = await fetch("https://map.u00.io/set-json-hex/" + itemAsHexString, {
        method: "GET",
    });
    if (response.ok) {
        const responseData = await response.text();
        console.log("Response from server:", responseData);
    } else {
        console.error("Error setting item value:", response.status, response.statusText);
    }

    // open the URL in a new tab
    //const url = "https://u00.io/native/" + addr;
    //window.open(url, '_blank');
}

function openItem() {
    const addr = "0x" + toHex(keyPair.publicKey);
    const url = "https://u00.io/native/" + addr;
    window.open(url, '_blank');
}

generateKey();
