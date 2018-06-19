const {app, BrowserWindow, Menu, Tray} = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const url = require('url');

let win = null

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
    const iconPath = path.join(__dirname, 'icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath);
    tray = new Tray(trayIcon);
    console.log("I'm tryna boot")
    win = new BrowserWindow({
        width: 600,
        height: 400,
        frame: false
    })

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
        win = null;
    })
}

app.on('ready', boot)


//Catching closing events
//https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/4