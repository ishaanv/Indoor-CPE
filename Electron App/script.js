const {remote} = require('electron')

document.getElementById('close').addEventListener('click', closeWindow);
document.getElementById('minimise').addEventListener('click', minimiseWindow);
document.getElementById('maximise').addEventListener('click', maximiseWindow);

function closeWindow() {
    var window = remote.getCurrentWindow()
    window.close()
}

function minimiseWindow() {
    var window = remote.getCurrentWindow()
    window.minimize()
}

function maximiseWindow() {
    var window = remote.getCurrentWindow()
    if(window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize(); 
    };
}