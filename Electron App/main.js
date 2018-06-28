const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const url = require('url');

//Auto update stuff
const {autoUpdater} = require('electron-updater');
const appVersion = require('./package.json').version;
const os = require('os').platform();

let win = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (win) {
        // Bringing the window back to the forefront if someone tries to restart the app
        console.log(win)
        if (win.isVisible()==false) win.show();
        if (win.isMinimized()) win.restore();
        win.focus();
    } else {
        console.log("tryna bring it back")
        win = new BrowserWindow({
            width: 600,
            height: 400,
            frame: false
        })
    }
});

if (shouldQuit) {
    app.quit();
    return;
}

function boot() {
    global.hideNotClose = true;
    const iconPath = path.join(__dirname, 'icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath);
    tray = new Tray(trayIcon);
    console.log("I'm tryna boot")
    win = new BrowserWindow({
        width: 600,
        height: 400,
        frame: true
    })

    autoUpdater.checkForUpdates();

    //https://github.com/electron/electron/blob/master/docs/api/tray.md

    const contextMenu = Menu.buildFromTemplate([
        {label: "Don't interrupt me", type: 'radio'},
        {label: "If it's important", type: 'radio'},
        {label: "Can be interrupted", type: 'radio', checked: true},
        {label: 'Off', type: 'radio'}
    ])
    tray.setToolTip('Oatmeal')
    tray.setContextMenu(contextMenu)
    win.loadURL(`file://${__dirname}/index.html`)
    win.on('close', (e) => {
        if (global.hideNotClose) {
            e.preventDefault()
            win.hide();
        } else {
            win = null;
        }
    })
}


// When the update has been downloaded and is ready to be installed, quit and install it
autoUpdater.on('update-downloaded', (info) => {
    alert("Quitting and installing the updated version of the app")
    autoUpdater.quitAndInstall();
});


app.on('ready', boot)


//Catching closing events
//https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/4