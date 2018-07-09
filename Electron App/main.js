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
        fakeLog(["<br /><br /><br />", counter, timeNow, " buffer: ", ringBuffer, "|End of buffer"]);
    }
}

function saveData(data){
    //TODO: uncoment these lines, 
    var d = decodeData(data);
    console.log("(saveData) printing:\n", data, d);
    // appendToRing(d);
}

function fakeLog(text){
    if(Array.isArray(text)){ //// if(text.isArray()){
        text = text.join("    ");
    }
    console.log("fakeLog:",text);
    // var electronText = document.querySelector("#text");
    // electronText.innerHTML += 'Extra stuff';
}

function dateStamp() {
    return new Date(Date.now()).toString();
}


// {"comName":     "COM3",
//  "manufacturer":"Microsoft",
//  "serialNumber":"9892DC431475D4050213E273020131FF",
//  "pnpId":       "USB\\VID_239A&PID_8019&MI_00\\6&300890CF&0&0000",
//  "locationId":  "0000.0014.0000.003.000.000.000.000.000",
//  "vendorId":    "239A",
//  "productId":   "8019"}
function isCPE(port) {
    return (port.vendorId === "239A") && (port.productId === "8019");
}

function searchForCPE() {
    return new Promise((resolve, reject)=>{
        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                if (isCPE(port)) {
                    resolve(port);
                }
            });
        });
    });
}

function getPortInfo() {
    return new Promise((resolve, reject)=>{
        let thisPort = searchForCPE().then(thisPort => {
            if(thisPort == undefined){
                reject("can't find a CPE is it plugged in?");
            } else {
                resolve(thisPort);            
            }
        });
    });
}

function handleSensor(portDetails) {
    //****Open the port*****/
    const parsers = SerialPort.parsers;    
    // Use a `\r\n` as a line terminator
    const parser = new parsers.Readline({ delimiter: '\r\n' });

    const port = new SerialPort(portDetails.comName, { baudRate: 115200 });

    // console.log("\n\nport seems to be open. With data:", port);
    port.pipe(parser);

    port.on('open', (x) => console.log('\n\nPort open', x));

    parser.on('data', saveData);

    // //****Draw the graph*****/
    // const timeToKeepMS = 1*1000; //in milliseconds
    // var ringBuffer = [];  
    // let startTime = new Date(Date.now() + 3000);
    // var j = schedule.scheduleJob({start: startTime, rule: '*/1 * * * * *'}, function(){
    //     //TODO: hook this up so that it draws the graph
    //     fakeLog(dateStamp(), "//call to graph drawing");
    // });
}

function cerial() {
    getPortInfo()
        .then( portDetails => handleSensor(portDetails))   
        .error(error       => console.log(error));
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
        width:  600,
        height: 400,
        frame:  true,
        show:   false
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
    tray.setToolTip('Oatmeal');
    tray.setContextMenu(contextMenu);

    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.on('did-finish-load', ()=>{
        let code = `var t = document.getElementById("text");
                    t.innerHTML = "goat meal!"`;
        win.webContents.executeJavaScript(code);
    });

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
	console.log('isDev?:', 'Running in development');
} else {
	console.log('isDev?:', 'Running in production');
}

let win = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (win) {
        // Bringing the window back to the forefront if someone tries to restart the app
        console.log(win);
        if (win.isVisible()==false) win.show();
        if (win.isMinimized()) win.restore();
        win.focus();
    } else {
        console.log("tryna bring it back (shouldQuit)")
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



