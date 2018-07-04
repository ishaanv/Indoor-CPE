function decodeData(d) {
    // console.log("1", d)
    d = d.split(': ');
    // console.log("2", d[0])
    var sensorType = d[0];
    var value = d[1];
    return {
        sensorType: sensorType,
        value: value,
        timeStamp: Date.now(),
    };
}

function appendToRing(newData) {
    ringBuffer.push(newData);
    var timeNow = newData.timeStamp;
    var cutoffTime = timeNow - timeToKeepMS;
    var x = ringBuffer.filter(d => d.timeStamp > cutoffTime);
    ringBuffer = x; // WILL SOMEONE PLEASE EXPLAIN THIS TO ME?
    // This is O(n), that's probably fine for small arrays. If perf
    // becomes an issue then we could loop from the tail and break
    // once we reach a value that we should keep.
    counter++;
    if (counter%10 == 0){
        fakeLog(["<br /><br /><br />", timeNow, ringBuffer]);
    }
}

function saveData(data){
    console.log("I'm recieving data, but I shouldn't be:", data);
    //TODO: uncoment these lines, 
    // var d = decodeData(data);
    // appendToRing(d);
}

function fakeLog(text){
    if(Array.isArray(text)){ //// if(text.isArray()){
        
        text = text.join("    ");
    }
    var electronText = document.querySelector("#text");
    electronText.innerHTML += 'Extra stuff';
}

function cerial(){
    let startTime = new Date(Date.now()+ 3000);

    var j = schedule.scheduleJob({start: startTime, rule: '*/1 * * * * *'}, function(){
        fakeLog(new Date(Date.now()).toString());
    });

    const parsers = SerialPort.parsers;
    const timeToKeepMS = 1*1000; //in milliseconds

    var ringBuffer = [];    

    // Use a `\r\n` as a line terminator
    const parser = new parsers.Readline({
        delimiter: '\r\n'
    });

    
    const port = new SerialPort('COM12', {
        baudRate: 115200
    });    
    

    console.log("port is open", port);
    port.pipe(parser);

    port.on('open', () => console.log('Port open'));

    parser.on('data', saveData);

    // port.write('ROBOT PLEASE RESPOND\n');

    
    // The parser will emit any string response
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
        frame: true,
        show: false
    });


    if (isDev) {
        console.log('is dev, not checking for updates at the moment');
    } else {
        autoUpdater.checkForUpdates();
    }

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
            console.log("window hidden but process not ended; intentional.");
        } else {
            win = null;
        }
    });
    
    win.once('ready-to-show', () => {
        console.log("ready to show");
        win.show();
        cerial();
      });
    console.log("AT THE END OF BOOT!!!!!");
}

const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const url = require('url');

//Auto update stuff
const {autoUpdater} = require('electron-updater');
const appVersion = require('./package.json').version;
const os = require('os').platform();

const isDev = require('electron-is-dev');

const SerialPort = require('serialport');
const schedule = require('node-schedule');

if (isDev) {
	console.log('Running in development');
} else {
	console.log('Running in production');
}

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

// When the update has been downloaded and is ready to be installed, quit and install it
autoUpdater.on('update-downloaded', (info) => {
    alert("Quitting and installing the updated version of the app")
    autoUpdater.quitAndInstall();
});


app.on('ready', boot)


//Catching closing events
//https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/4



