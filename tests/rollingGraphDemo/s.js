(function() {

var all_data = {"temperature": [{"time": "2018-06-27T17:41:43.049000", "epochtime": 1530085303049, "value": 17}, {"time": "2018-06-27T17:41:44.253000", "epochtime": 1530085304253, "value": 23}, {"time": "2018-06-27T17:41:44.858000", "epochtime": 1530085304858, "value": 25}, {"time": "2018-06-27T17:41:46.065000", "epochtime": 1530085306065, "value": 16}, {"time": "2018-06-27T17:41:47.188000", "epochtime": 1530085307188, "value": 17}, {"time": "2018-06-27T17:41:49.622000", "epochtime": 1530085309622, "value": 27}, {"time": "2018-06-27T17:41:50.927000", "epochtime": 1530085310927, "value": 23}, {"time": "2018-06-27T17:41:51.641000", "epochtime": 1530085311641, "value": 15}, {"time": "2018-06-27T17:41:52.867000", "epochtime": 1530085312867, "value": 18}, {"time": "2018-06-27T17:41:54.187000", "epochtime": 1530085314187, "value": 16}, {"time": "2018-06-27T17:41:54.793000", "epochtime": 1530085314793, "value": 27}, {"time": "2018-06-27T17:41:55.788000", "epochtime": 1530085315788, "value": 25}, {"time": "2018-06-27T17:41:56.748000", "epochtime": 1530085316748, "value": 23}, {"time": "2018-06-27T17:41:57.268000", "epochtime": 1530085317268, "value": 26}, {"time": "2018-06-27T17:41:58.104000", "epochtime": 1530085318104, "value": 15}, {"time": "2018-06-27T17:41:59.043000", "epochtime": 1530085319043, "value": 15}, {"time": "2018-06-27T17:42:00.393000", "epochtime": 1530085320393, "value": 18}, {"time": "2018-06-27T17:42:01.119000", "epochtime": 1530085321119, "value": 27}, {"time": "2018-06-27T17:42:02.112000", "epochtime": 1530085322112, "value": 18}, {"time": "2018-06-27T17:42:02.759000", "epochtime": 1530085322759, "value": 23}, {"time": "2018-06-27T17:42:03.504000", "epochtime": 1530085323504, "value": 21}, {"time": "2018-06-27T17:42:04.453000", "epochtime": 1530085324453, "value": 24}, {"time": "2018-06-27T17:42:05.546000", "epochtime": 1530085325546, "value": 17}, {"time": "2018-06-27T17:42:06.097000", "epochtime": 1530085326097, "value": 22}, {"time": "2018-06-27T17:42:06.607000", "epochtime": 1530085326607, "value": 21}, {"time": "2018-06-27T17:42:07.287000", "epochtime": 1530085327287, "value": 23}, {"time": "2018-06-27T17:42:08.139000", "epochtime": 1530085328139, "value": 15}, {"time": "2018-06-27T17:42:09.224000", "epochtime": 1530085329224, "value": 17}, {"time": "2018-06-27T17:42:09.961000", "epochtime": 1530085329961, "value": 25}, {"time": "2018-06-27T17:42:10.470000", "epochtime": 1530085330470, "value": 20}, {"time": "2018-06-27T17:42:11.264000", "epochtime": 1530085331264, "value": 20}, {"time": "2018-06-27T17:42:13.222000", "epochtime": 1530085333222, "value": 19}, {"time": "2018-06-27T17:42:14.199000", "epochtime": 1530085334199, "value": 22}, {"time": "2018-06-27T17:42:15.801000", "epochtime": 1530085335801, "value": 16}, {"time": "2018-06-27T17:42:18.023000", "epochtime": 1530085338023, "value": 15}, {"time": "2018-06-27T17:42:20.276000", "epochtime": 1530085340276, "value": 19}, {"time": "2018-06-27T17:42:21.747000", "epochtime": 1530085341747, "value": 16}, {"time": "2018-06-27T17:42:22.746000", "epochtime": 1530085342746, "value": 19}, {"time": "2018-06-27T17:42:25.457000", "epochtime": 1530085345457, "value": 21}, {"time": "2018-06-27T17:42:26.078000", "epochtime": 1530085346078, "value": 18}, {"time": "2018-06-27T17:42:26.712000", "epochtime": 1530085346712, "value": 24}, {"time": "2018-06-27T17:42:27.771000", "epochtime": 1530085347771, "value": 23}, {"time": "2018-06-27T17:42:29.226000", "epochtime": 1530085349226, "value": 16}, {"time": "2018-06-27T17:42:30.610000", "epochtime": 1530085350610, "value": 24}, {"time": "2018-06-27T17:42:33.036000", "epochtime": 1530085353036, "value": 19}, {"time": "2018-06-27T17:42:33.717000", "epochtime": 1530085353717, "value": 16}, {"time": "2018-06-27T17:42:34.763000", "epochtime": 1530085354763, "value": 18}, {"time": "2018-06-27T17:42:37.036000", "epochtime": 1530085357036, "value": 17}, {"time": "2018-06-27T17:42:38.091000", "epochtime": 1530085358091, "value": 25}, {"time": "2018-06-27T17:42:43.979000", "epochtime": 1530085363979, "value": 21}, {"time": "2018-06-27T17:42:45.603000", "epochtime": 1530085365603, "value": 24}, {"time": "2018-06-27T17:42:46.854000", "epochtime": 1530085366854, "value": 21}, {"time": "2018-06-27T17:42:47.983000", "epochtime": 1530085367983, "value": 26}, {"time": "2018-06-27T17:42:50.697000", "epochtime": 1530085370697, "value": 24}, {"time": "2018-06-27T17:42:51.441000", "epochtime": 1530085371441, "value": 26}, {"time": "2018-06-27T17:42:52.870000", "epochtime": 1530085372870, "value": 24}, {"time": "2018-06-27T17:42:54.227000", "epochtime": 1530085374227, "value": 21}, {"time": "2018-06-27T17:42:56.294000", "epochtime": 1530085376294, "value": 23}, {"time": "2018-06-27T17:42:58.515000", "epochtime": 1530085378515, "value": 16}, {"time": "2018-06-27T17:42:59.190000", "epochtime": 1530085379190, "value": 26}, {"time": "2018-06-27T17:42:59.877000", "epochtime": 1530085379877, "value": 19}, {"time": "2018-06-27T17:43:00.922000", "epochtime": 1530085380922, "value": 18}, {"time": "2018-06-27T17:43:01.855000", "epochtime": 1530085381855, "value": 26}, {"time": "2018-06-27T17:43:03.114000", "epochtime": 1530085383114, "value": 15}, {"time": "2018-06-27T17:43:04.136000", "epochtime": 1530085384136, "value": 19}, {"time": "2018-06-27T17:43:06.813000", "epochtime": 1530085386813, "value": 19}, {"time": "2018-06-27T17:43:07.367000", "epochtime": 1530085387367, "value": 21}, {"time": "2018-06-27T17:43:08.737000", "epochtime": 1530085388737, "value": 22}, {"time": "2018-06-27T17:43:10.890000", "epochtime": 1530085390890, "value": 22}, {"time": "2018-06-27T17:43:12.357000", "epochtime": 1530085392357, "value": 21}, {"time": "2018-06-27T17:43:14.183000", "epochtime": 1530085394183, "value": 18}, {"time": "2018-06-27T17:43:14.845000", "epochtime": 1530085394845, "value": 19}, {"time": "2018-06-27T17:43:16.099000", "epochtime": 1530085396099, "value": 19}, {"time": "2018-06-27T17:43:17.459000", "epochtime": 1530085397459, "value": 17}, {"time": "2018-06-27T17:43:18.802000", "epochtime": 1530085398802, "value": 25}, {"time": "2018-06-27T17:43:19.638000", "epochtime": 1530085399638, "value": 26}, {"time": "2018-06-27T17:43:20.624000", "epochtime": 1530085400624, "value": 26}], "soundVolume": [{"time": "2018-06-27T17:41:42.148000", "epochtime": 1530085302148, "value": 38}, {"time": "2018-06-27T17:41:43.049000", "epochtime": 1530085303049, "value": 17}, {"time": "2018-06-27T17:41:46.065000", "epochtime": 1530085306065, "value": 33}, {"time": "2018-06-27T17:41:47.188000", "epochtime": 1530085307188, "value": 17}, {"time": "2018-06-27T17:41:49.622000", "epochtime": 1530085309622, "value": 18}, {"time": "2018-06-27T17:41:54.793000", "epochtime": 1530085314793, "value": 31}, {"time": "2018-06-27T17:41:55.788000", "epochtime": 1530085315788, "value": 17}, {"time": "2018-06-27T17:41:56.748000", "epochtime": 1530085316748, "value": 35}, {"time": "2018-06-27T17:41:57.268000", "epochtime": 1530085317268, "value": 32}, {"time": "2018-06-27T17:42:00.393000", "epochtime": 1530085320393, "value": 34}, {"time": "2018-06-27T17:42:01.119000", "epochtime": 1530085321119, "value": 22}, {"time": "2018-06-27T17:42:04.453000", "epochtime": 1530085324453, "value": 18}, {"time": "2018-06-27T17:42:05.546000", "epochtime": 1530085325546, "value": 44}, {"time": "2018-06-27T17:42:06.097000", "epochtime": 1530085326097, "value": 4}, {"time": "2018-06-27T17:42:09.961000", "epochtime": 1530085329961, "value": 6}, {"time": "2018-06-27T17:42:11.264000", "epochtime": 1530085331264, "value": -2}, {"time": "2018-06-27T17:42:12.457000", "epochtime": 1530085332457, "value": 22}, {"time": "2018-06-27T17:42:14.199000", "epochtime": 1530085334199, "value": 42}, {"time": "2018-06-27T17:42:15.801000", "epochtime": 1530085335801, "value": 49}, {"time": "2018-06-27T17:42:18.023000", "epochtime": 1530085338023, "value": 5}, {"time": "2018-06-27T17:42:18.958000", "epochtime": 1530085338958, "value": 2}, {"time": "2018-06-27T17:42:22.746000", "epochtime": 1530085342746, "value": 19}, {"time": "2018-06-27T17:42:23.509000", "epochtime": 1530085343509, "value": 43}, {"time": "2018-06-27T17:42:24.586000", "epochtime": 1530085344586, "value": -7}, {"time": "2018-06-27T17:42:25.457000", "epochtime": 1530085345457, "value": 13}, {"time": "2018-06-27T17:42:29.226000", "epochtime": 1530085349226, "value": 19}, {"time": "2018-06-27T17:42:30.610000", "epochtime": 1530085350610, "value": 8}, {"time": "2018-06-27T17:42:33.717000", "epochtime": 1530085353717, "value": 18}, {"time": "2018-06-27T17:42:34.763000", "epochtime": 1530085354763, "value": -9}, {"time": "2018-06-27T17:42:35.854000", "epochtime": 1530085355854, "value": 0}, {"time": "2018-06-27T17:42:39.401000", "epochtime": 1530085359401, "value": 41}, {"time": "2018-06-27T17:42:41.248000", "epochtime": 1530085361248, "value": 28}, {"time": "2018-06-27T17:42:43.979000", "epochtime": 1530085363979, "value": 19}, {"time": "2018-06-27T17:42:45.100000", "epochtime": 1530085365100, "value": 36}, {"time": "2018-06-27T17:42:45.603000", "epochtime": 1530085365603, "value": 21}, {"time": "2018-06-27T17:42:47.983000", "epochtime": 1530085367983, "value": 2}, {"time": "2018-06-27T17:42:49.248000", "epochtime": 1530085369248, "value": 34}, {"time": "2018-06-27T17:42:51.985000", "epochtime": 1530085371985, "value": 10}, {"time": "2018-06-27T17:42:58.515000", "epochtime": 1530085378515, "value": 30}, {"time": "2018-06-27T17:42:59.877000", "epochtime": 1530085379877, "value": 27}, {"time": "2018-06-27T17:43:00.922000", "epochtime": 1530085380922, "value": 26}, {"time": "2018-06-27T17:43:03.114000", "epochtime": 1530085383114, "value": 40}, {"time": "2018-06-27T17:43:04.777000", "epochtime": 1530085384777, "value": 5}, {"time": "2018-06-27T17:43:05.899000", "epochtime": 1530085385899, "value": -6}, {"time": "2018-06-27T17:43:06.813000", "epochtime": 1530085386813, "value": 17}, {"time": "2018-06-27T17:43:07.367000", "epochtime": 1530085387367, "value": 12}, {"time": "2018-06-27T17:43:09.910000", "epochtime": 1530085389910, "value": 5}, {"time": "2018-06-27T17:43:10.890000", "epochtime": 1530085390890, "value": 47}, {"time": "2018-06-27T17:43:13.285000", "epochtime": 1530085393285, "value": 2}, {"time": "2018-06-27T17:43:14.183000", "epochtime": 1530085394183, "value": 28}, {"time": "2018-06-27T17:43:18.802000", "epochtime": 1530085398802, "value": 28}, {"time": "2018-06-27T17:43:19.638000", "epochtime": 1530085399638, "value": -4}, {"time": "2018-06-27T17:43:20.624000", "epochtime": 1530085400624, "value": 4}]};



function getValue(dataPair) {
  return dataPair["value"];
}

function getTime(dataPair) {
  return dataPair["time"];
}

function getData(thisManyMiliseconds){

  let filtered = dataPointsinWindow(currentlyAt, thisManyMiliseconds);
  let d = [   {  x: filtered.temperature.map(getTime),
                 y: filtered.temperature.map(getValue),
                 name: "Temperature",
            }, { x: filtered.soundVolume.map(getTime),
                 y: filtered.soundVolume.map(getValue),
                 name: "Volume",
            }];
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
    return { "temperature": t, "soundVolume": s };
}

function updateGraph() {
    counter++;
    currentlyAt = currentlyAt + step;
    Plotly.react("graph", getData(windowLength), layout);

    if (currentlyAt > Math.max(...tet)) {
      clearInterval(interval);
      console.log("Out of data");
    }
}

var tet = all_data.temperature.map(x => x.epochtime)
var startAt = 1530085303049;
var step = 1000; // in ms
var currentlyAt = startAt + step;
var windowLength = 30*1000;

var layout = {
  title: `${windowLength/1000} seconds of data`,
  plot_bgcolor: "hsl(200, 18%, 80%)",
  paper_bgcolor: "hsl(200, 18%, 20%)",
  font: {color: "hsla(250, 5%, 85%, 1)"}
};

Plotly.plot("graph", getData(windowLength), layout);

var counter = 0;

var interval = setInterval(updateGraph, step);


        })();