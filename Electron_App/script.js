const {remote} = require('electron');

// https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/7


document.getElementById('close').addEventListener('click', closeWindow);
document.getElementById('minimise').addEventListener('click', minimiseWindow);
document.getElementById('maximise').addEventListener('click', maximiseWindow);

/**
 * Closes the window
 */
function closeWindow() {
    console.log('I\'m tryna close');
    window.close();
}

/**
 * Minimises the window
 */
function minimiseWindow() {
    console.log('I\'m tryna minimise');
    let window = remote.getCurrentWindow();
    window.minimize();
}

/**
 * Maximises the window
 */
function maximiseWindow() {
    console.log('I\'m tryna maximise');
    let window = remote.getCurrentWindow();
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    };
}

console.log("I AM IN SCRIPT!!!")