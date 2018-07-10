(function() {
  //converting from:
  //var all_data = {
  //                'soundVolume': [{'value': 15834.0, 'epochtime':1234567890, 'time': '2018-06-27T15:57:15.016753'}, {'value': 15787.3, 'epochtime':1234567890, 'time': '2018-06-27T15:57:15.103559'}],
  //                'temperature': [{'value': 23.0654, 'epochtime':1234567890, 'time': '2018-06-27T15:57:15.333167'}, {'value': 22.8484, 'epochtime':1234567890, 'time': '2018-06-27T15:57:16.335919'}]
  //               }
  // adding epoch time, then ready to go, needs to recieve:
  // 
  //   {
  //     sensorType: sensorType,
  //     value: value,
  //     timeStamp: Date.now(),
  //   }
var all_data = window.ringBuffer;
console.log(all_data);

function addEpochTime(packet){
  packet['epochtime'] = new Date(packet.time).getTime();
  return packet;
}

all_data.soundVolume = all_data.soundVolume.map(addEpochTime);
all_data.temperature = all_data.temperature.map(addEpochTime);

window.loadsOfData = all_data;


function getValue(dataPair) {
  return dataPair['value'];
}

function getTime(dataPair) {
  return dataPair['time'];
}

var lastVal = 0;
function randomData(dataPair) {
  return lastVal + (Math.random()-0.5);
}

function getData(thisManyMiliseconds){

  let filtered = dataPointsinWindow(currentlyAt, thisManyMiliseconds);
  let t = { x: filtered.temperature.map(getTime),
            y: filtered.temperature.map(getValue),
            name: 'Temperature',
            // yaxis: 'y1'
            type: 'scatter',
          };
  let s = { x: filtered.soundVolume.map(getTime),
            y: filtered.soundVolume.map(getValue),
            name: 'Sound Volume',
            yaxis: 'y2',
            type: 'scatter',
          };
  let l = { x: filtered.soundVolume.map(getTime),
            y: filtered.soundVolume.map(randomData),
            name: 'Light stuff',
            yaxis: 'y3',
            type: 'scatter',
          };
  let d = [t, s, l];

  console.log(d);
  return d;
}


/**
 * Get all the data that's in the current time window.
 * @param {int} windowEnd - the time that we want data before
 * @param {int} thisManySeconds - the size of the window before the cutoff time
 * @returns object of data
 */
function dataPointsinWindow(windowEnd, thisManyMiliseconds) {
    let trailingEdge = windowEnd - thisManyMiliseconds;
    let t = all_data.temperature.filter(r => r.epochtime < windowEnd && r.epochtime > trailingEdge);
    let s = all_data.soundVolume.filter(r => r.epochtime < windowEnd && r.epochtime > trailingEdge); 
    return { 'temperature': t, 'soundVolume': s };
}

function updateGraph() {
    counter++;
    currentlyAt = currentlyAt + step;
    Plotly.react('graph', getData(windowLength), layout);

    if (currentlyAt > Math.max(...tet)) {
      clearInterval(interval);
      console.log('Out of data');
    }
}

var tet = all_data.temperature.map(x => x.epochtime)
var startAt = Math.min(...tet);
var step = 1000; // in ms
var currentlyAt = startAt + step;
var windowLength = 30*1000;

var layout = {
  title: `A rolling ${windowLength/1000} seconds of data`,
  // width: 1200, 
  plot_bgcolor: 'hsl(200, 18%, 80%)',
  paper_bgcolor: 'hsl(200, 18%, 20%)',
  font: {color: 'hsla(250, 5%, 85%, 1)'},
  xaxis: {domain: [0.1, 0.99]}, 
  yaxis: {
    title: 'Temperature', 
    titlefont: {color: 'rgb(31, 119, 180)'}, 
    tickfont: {color: 'rgb(31, 119, 180)'}
  }, 
  yaxis2: {
    title: 'Sound Volume', 
    titlefont: {color: 'rgb(255, 127, 14)'}, 
    tickfont:  {color: 'rgb(255, 127, 14)'}, 
    anchor: 'free', 
    overlaying: 'y', 
    side: 'left', 
    position: 0
  }, 
  yaxis3: {
    title: 'Light stuff', 
    titlefont: {color: 'rgb(44, 160, 44)'}, 
    tickfont:  {color: 'rgb(44, 160, 44)'}, 
    anchor: 'x', 
    overlaying: 'y', 
    side: 'right'
  }
};

Plotly.plot('graph', getData(windowLength), layout);

var counter = 0;

var interval = setInterval(updateGraph, step);


        })();