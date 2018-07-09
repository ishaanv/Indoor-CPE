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
    if (counter%80 == 0){
        fakeLog(["<p>", counter, timeNow, " buffer: ", ringBuffer, "|EOB</p>"]);
    }
}


function saveData(data){
    var d = decodeData(data);
    appendToRing(d);
    // console.log("(saveData) printing:\n", data, d);
}


function fakeLog(text){
    if(Array.isArray(text)){
        text = text.map(x => JSON.stringify(x));
        text = text.join(", ");
    }
    console.log("log text is", typeof(text));
    console.log("\n", "fakeLog:", text);
    let code = `var t = document.getElementById("log");
                    t.innerHTML = "${text}"`;
    win.webContents.executeJavaScript(code);
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
                    return;
                }
            });
        });
        // TODO: Below, this rejects non-async, so it rejects before it finds the CPE, which sucks, so I've commented it out, how do we atually resolve?
        // reject("In 'searchForCPE', didn't find a CPE. Is it plugged in?");
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
    
    const parser = new parsers.Readline({ delimiter: '\r\n' }); // Use a `\r\n` as a line terminator

    const port = new SerialPort(portDetails.comName, { baudRate: 115200 });

    // console.log("\n\nport seems to be open. With data:", port);
    port.pipe(parser);

    port.on('open', (x) => console.log('\n\nPort open', x)); //TODO: get this to resolve the port name, not undefined

    parser.on('data', saveData);

    //****Draw the graph*****/
    drawGraph();
}


function drawGraph() {
    let startTime = new Date(Date.now() + 3000);
    var j = schedule.scheduleJob({ start: startTime, rule: '*/1 * * * * *' }, function () {
        //TODO: hook this up so that it draws the graph
        fakeLog(dateStamp(), "//call to graph drawing");
    });
}


function cerial() {
    getPortInfo()
        .then( portDetails => handleSensor(portDetails))   
        .catch(error       => console.log(error));
    // port.write('ROBOT PLEASE RESPOND\n');
    // The parser will emit any string response
}


function boot() {
    if (isDev) {
        console.log('is dev, not checking for updates at the moment');
    } else {
        autoUpdater.checkForUpdates();
    }

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
    win.maximize();
    win.webContents.openDevTools();


    //https://electronjs.org/docs/api/tray There's loads of stuff this can do!
    const contextMenu = Menu.buildFromTemplate([
        {label: "Don't interrupt me", type: 'radio'},
        {label: "If it's important",  type: 'radio'},
        {label: "Can be interrupted", type: 'radio', checked: true},
        {label: 'Off',                type: 'radio'}
    ])
    tray.setToolTip('Oatmeal');
    tray.setContextMenu(contextMenu);

    win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.on('did-finish-load', ()=>{
        let code = `var t = document.getElementById("log");
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


function reportIsDev() {
    if (isDev) {
        console.log('isDev?:', 'Running in development');
    }
    else {
        console.log('isDev?:', 'Running in production');
    }
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

const timeToKeepMS = 30 * 1000; //in milliseconds //TODO: add this to the UI and make it variable
var ringBuffer = [];
var counter = 0;

reportIsDev();

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
