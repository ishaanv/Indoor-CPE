/**
 * Takes data directly from the CPE, formats it
 * and time stamps it in a format for the buffer.
 *
 * @param {string} d The data
 * @return {object}
 */
function decodeData(d) {
    d = d.split(': ');
    let sensorType = d[0];
    let value = d[1];
    return {
        sensorType: sensorType,
        value: value,
        timeStamp: Date.now(),
    };
}


function getDriveLetterOfCPE() { 
    return new Promise((resolve, reject) => {
        let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
        });
        
        ps.addCommand('Get-CimInstance Win32_logicaldisk')
        ps.invoke()
            .then(output => {
                let lines = output.split("\n");
                let cpeLine = lines.filter(line => line.indexOf("CIRCUITPY") != -1);
                let parts = cpeLine[0].split(/\s+/);
                let driveLetter = parts[0][0];
                /* This isn't actually needed, could just pull the first letter 
                    of the line. This could be a bit more robust if I looked for 
                    the part with the colon. */
                console.log("CPE drive letter:", driveLetter);
                ps.dispose();
                CPEdriveLetter = driveLetter;
                resolve(driveLetter);
            })
            .catch(err => {
                console.log(err);
                ps.dispose();
                reject(err);
            }
        );
    });
}

let counter = 0;
/**
 * Adds data to the buffer, and trims old data off the back edge
 * The ring is a time limtied circular buffer.
 * @param {object} newData
 */
function appendToRing(newData) {
    global.ringBuffer.push(newData);
    let timeNow = newData.timeStamp;
    let cutoffTime = timeNow - timeToKeepMS;
    let x = global.ringBuffer.filter((d) => d.timeStamp > cutoffTime);
    // don't need to check for times in the future, because they aren't here yet
    global.ringBuffer = x; // WILL SOMEONE PLEASE EXPLAIN THIS TO ME?
    // This is O(n), that's probably fine for small arrays. If perf
    // becomes an issue then we could loop from the tail and break
    // once we reach a value that we should keep.
    counter++;
    if (counter%80 == 0) {
        fakeLog(['<p>', counter, timeNow, ' buffer: ',
                 global.ringBuffer, '|EOB</p>']);
    }
}


/**
 * Takes data raw from the serial port, formats it and
 * saves it to the ring buffer
 * @param {string} data
 */
function saveData(data) {
    let d = decodeData(data);
    appendToRing(d);
}


/**
 * Fancy console.log
 * Can write to the main app screen, but it's probably pointless!
 * @param {string} text
 */
function fakeLog(text) {
    if (Array.isArray(text)) {
        text = text.map((x) => JSON.stringify(x));
        text = text.join(', ');
    }
    // console.log("log text is", typeof(text));
    // console.log("\n", "fakeLog:", text);
    // let code = `var t = document.getElementById("log");
    //                 t.innerHTML = "${text}"`;
    // win.webContents.executeJavaScript(code);
}


/**
 * Checks the thing on each port to see if it matches the VID and PID
 * of the CPE (shown here)
 * {"comName":     "COM3",
    "manufacturer":"Microsoft",
    "serialNumber":"9892DC431475D4050213E273020131FF",
    "pnpId":       "USB\\VID_239A&PID_8019&MI_00\\6&300890CF&0&0000",
    "locationId":  "0000.0014.0000.003.000.000.000.000.000",
    "vendorId":    "239A",
    "productId":   "8019"}
 * @param {object} port
 * @return {boolean}
 */
function isCPE(port) {
    return (port.vendorId === '239A') && (port.productId === '8019');
}


/**
 * Async, searches the serial ports for things,
 * if they're a CPE, sends that back
 * Resolves an object
 * @return {undefined}
 */
function searchForCPE() {
    return new Promise((resolve, reject)=>{
        SerialPort.list(function(err, ports) {
            ports.forEach(function(port) {
                if (isCPE(port)) {
                    resolve(port);
                    return;
                }
            });
        });
        /* TODO: Below, this rejects non-async, so it rejects before
           it finds the CPE, which sucks, so I've commented it out,
           how do we atually resolve? */
        // reject("In 'searchForCPE', didn't find a CPE. Is it plugged in?");
    });
}


/**
 * the other half of searchForCPE
 * I couldn't work out how to do this in one promise
 * @return {object} port details
 */
function getPortInfo() {
    return new Promise((resolve, reject)=>{
        searchForCPE().then((thisPort) => {
            if (thisPort == undefined) {
                reject('can\'t find a CPE is it plugged in?');
            } else {
                resolve(thisPort);
            }
        });
    });
}


/**
 * Finds the sensor and deals with data as it comes in
 *
 * @param {object} portDetails
 */
function handleSensor(portDetails) {
    //* ***Open the port*****/
    const parsers = SerialPort.parsers;

    const parser = new parsers.Readline({delimiter: '\r\n'});

    const port = new SerialPort(portDetails.comName, {baudRate: 115200});

    // console.log("\n\nport seems to be open. With data:", port);
    port.pipe(parser);

    port.on('open', (x) => console.log('\n\nPort open', x));
    // TODO: get this to resolve the port name, not undefined

    parser.on('data', saveData);
}


/**
 * Finds the port, probably, or emits an error
 *
 */
function cerial() {
    getPortInfo()
        .then( (portDetails) => handleSensor(portDetails))
        .catch((error) => console.log(error));
    // port.write('ROBOT PLEASE RESPOND\n');
    // The parser will emit any string response
}


/**
 * Entry point, does a lot of setup
 */
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
    // https://electronjs.org/docs/api/tray There's loads of stuff this can do!
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Show',
          sublabel: 'I\'m a sublabel',
          click: (item, window, event) => {
                console.log(item, event);
                },
        },
        {type: 'separator'},
        {label: 'Don\'t interrupt me',
          type: 'radio',
          groupId: 1,
          icon: path.join(__dirname, 'assets', 'icons', 'red.jpg'),
          sublabel: 'I\'m a sublabel',
          click: (item, window, event) => {
                handleLightStatus('highFocus', item, window, event);
                },
        },
        {label: 'If it\'s important',
          type: 'radio',
          groupId: 1,
          icon: path.join(__dirname, 'assets', 'icons', 'green.png'),
          click: (item, window, event) => {
                handleLightStatus('medFocus', item, window, event);
                },
        },
        {label: 'Can be interrupted',
          type: 'radio',
          groupId: 1,
          icon: path.join(__dirname, 'assets', 'icons', 'orange.jpg'),
          click: (item, window, event) => {
                handleLightStatus('lowFocus', item, window, event);
                },
          checked: true},
        {label: 'Lights Off',
          type: 'radio',
          groupId: 1,
          icon: path.join(__dirname, 'assets', 'icons', 'black.jpg'),
          click: (item, window, event) => {
                handleLightStatus('off', item, window, event);
                },
        },
    ]);
    tray.setToolTip('Oatmeal');
    tray.setContextMenu(contextMenu);

    win = new BrowserWindow({
        width: 1200,
        height: 900,
        frame: true,
        show: false,
    });
    // win.maximize();
    // win.webContents.openDevTools();
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.on('did-finish-load', ()=>{
        fakeLog('goat meal!');
    });

    win.on('close', (e) => {
        if (global.hideNotClose) {
            e.preventDefault();
            win.hide();
            console.log('window hidden but process not ended; intentional.');
        } else {
            win = null;
        }
    });

    win.once('ready-to-show', () => {
        console.log('ready to show');
        win.show();
        cerial();
      });
}


let fs = require('fs');
/**
 * Writes the hex string of the colour desired to the CPE
 * @param {string} colour
 */
function setLightColour(colour) {
    let CPEpath = path.join(CPEdriveLetter + ":", 'buffer.txt');
    console.log("CPEdriveLetter:", CPEdriveLetter, "CPEpath:", CPEpath);
    fs.writeFile(CPEpath, colour, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('The colour was saved!', colour);
    });

    fs.writeFile(CPEpath, "", function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('The colour buffer was clered');
    });
}

let convert = require('color-convert');
/**
 * handles clicks on the tray menu that controls the status lights.
 *
 * @param {string} status
 * @param {*} item
 * @param {*} window
 * @param {*} event
 */
function handleLightStatus(status, item, window, event) {
    let colour;
    switch (status) {
        case 'highFocus':
            colour = convert.rgb.hex( 0, 150, 0); // subdued red
            setLightColour(colour);
            // console.log("highFocus", item, window, event);
            break;
        case 'medFocus':
            colour = convert.rgb.hex(255, 150, 0); // orange
            setLightColour(colour);
            // console.log("medFocus", item, window, event);
            break;
        case 'lowFocus':
            colour = convert.rgb.hex( 0, 255, 0); // green
            setLightColour(colour);
            // console.log("lowFocus", item, window, event);
            break;
        case 'off':
            colour = convert.rgb.hex( 5, 5, 5); // almost black
            setLightColour(colour);
            // console.log("off", item, window, event);
            break;
        default:
          console.log(item, window, event,
            'something very strange happened.',
            'The menu option wasn\'t recognised.');
      }
}

/** Prints the context the app is built in */
function reportIsDev() {
    if (isDev) {
        console.log('isDev?:', 'Running in development');
    } else {
        console.log('isDev?:', 'Running in production');
    }
}

const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const nativeImage = require('electron').nativeImage;
const path = require('path');
const url = require('url');

// Auto update stuff
const {autoUpdater} = require('electron-updater');
const appVersion = require('./package.json').version;
const os = require('os').platform();

const isDev = require('electron-is-dev');
reportIsDev();

const SerialPort = require('serialport');

const shell = require('node-powershell');
let CPEdriveLetter = "X"; //Risk of a race condition
getDriveLetterOfCPE()
    .then(  d=>CPEdriveLetter=d)
    .catch( e=>console.log(e)  );


const timeToKeepMS = 5 * 1000; // in milliseconds
// TODO: add this to the UI and make it variable
global.ringBuffer = [];

let win; // this is the main wondow renderer process

let shouldQuit = app.makeSingleInstance(
    function(commandLine, workingDirectory) {
        if (win) {
            /* Bringing the window back to the forefront
            if someone tries to restart the app */
            console.log(win);
            if (win.isVisible()==false) win.show();
            if (win.isMinimized()) win.restore();
            win.focus();
        } else {
            console.log('tryna bring it back (shouldQuit)');
            win = new BrowserWindow({
                width: 600,
                height: 400,
                frame: false,
            });
        }
});

if (shouldQuit) {
    app.quit();
    // return;
    // TODO: 292:5  error  Parsing error: 'return' outside of function
}

/* When the update has been downloaded and is ready
   to be installed, quit and install it*/
autoUpdater.on('update-downloaded', (info) => {
    alert('Quitting and installing the updated version of the app');
    autoUpdater.quitAndInstall();
});


app.on('ready', boot);


// Catching closing events
// https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425/4
