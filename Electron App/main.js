const {app, BrowserWindow, Menu, Tray} = require('electron');
const url = require('url');

let win = null

function boot() {
    tray = new Tray('crown.ico')
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
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    win.loadURL(`file://${__dirname}/index.html`)
    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', boot)