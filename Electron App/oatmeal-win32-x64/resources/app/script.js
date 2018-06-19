const {remote} = require('electron')

//https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/7
hideNotClose = true;

document.getElementById('close').addEventListener('click', closeWindow);
document.getElementById('minimise').addEventListener('click', minimiseWindow);
document.getElementById('maximise').addEventListener('click', maximiseWindow);

function closeWindow() {
    console.log("I'm tryna close")
    var window = remote.getCurrentWindow()
    if (hideNotClose) {
        //e.preventDefault()
        window.hide();
    } else {
        window.close()
    }
}

function minimiseWindow() {
    console.log("I'm tryna minimise")
    var window = remote.getCurrentWindow()
    window.minimize()
}

function maximiseWindow() {
    console.log("I'm tryna maximise")
    var window = remote.getCurrentWindow()
    if(window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    };
}