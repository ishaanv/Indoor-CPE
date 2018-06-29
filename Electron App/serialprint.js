/* eslint-disable node/no-missing-require */
'use strict';

// Use a Readline parser

const SerialPort = require('serialport');
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

// external counter
var counter = 0

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
        console.log("\n\n\n", timeNow, ringBuffer.length);
    }


}

function saveData(data){
    var d = decodeData(data);
    appendToRing(d);
}

port.pipe(parser);

port.on('open', () => console.log('Port open'));

parser.on('data', saveData);

port.write('ROBOT PLEASE RESPOND\n');

// The parser will emit any string response