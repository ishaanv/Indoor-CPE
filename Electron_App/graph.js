const remote = require('electron').remote;
var ringBuffer = remote.getGlobal('ringBuffer');
const schedule = require('node-schedule');


function getValue(dataPair) {
    return dataPair['value'];
}
  
  
function getTime(dataPair) {
    return dataPair['timeStamp'];
}
  
  
function getData(buffer){
    // get data from buffer

    let sounds = buffer.filter(x => x.sensorType == "sound"); 
    let lights = buffer.filter(x => x.sensorType == "light");
    let temps  = buffer.filter(x => x.sensorType == "temperature");
    //TODO: this is terse, but not that efficient, is that an issue?

    let t = {   x: temps.map(getTime),
                y: temps.map(getValue),
                name: 'Temperature',
                // yaxis: 'y1'
                type: 'scatter',
            };
    let s = {   x: sounds.map(getTime),
                y: sounds.map(getValue),
                name: 'Sound Volume',
                yaxis: 'y2',
                type: 'scatter',
            };
    let l = {   x: lights.map(getTime),
                y: lights.map(getValue),
                name: 'Light stuff',
                yaxis: 'y3',
                type: 'scatter',
            };
    let d = [t, s, l];

    // console.log(d);
    return d;
}

  
var graphLayout = {
    title: `A rolling chunk of data`,
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

var emptyData =  [  {"sensorType":"sound","value":"15770.6","timeStamp":1531192827266},
                    {"sensorType":"sound","value":"15799.0","timeStamp":1531192827367},
                    {"sensorType":"light","value":"4752","timeStamp":1531192827372},
                    {"sensorType":"sound","value":"15796.1","timeStamp":1531192827471},
                    {"sensorType":"temperature","value":"20.4816","timeStamp":1531192827513},
                    {"sensorType":"sound","value":"15799.4","timeStamp":1531192827574},
                    {"sensorType":"light","value":"5296","timeStamp":1531192827580},
                    {"sensorType":"sound","value":"15788.1","timeStamp":1531192827679},
                    {"sensorType":"sound","value":"15780.5","timeStamp":1531192827779},
                    {"sensorType":"light","value":"4528","timeStamp":1531192827784},
                    {"sensorType":"sound","value":"15783.9","timeStamp":1531192827880},
                    {"sensorType":"sound","value":"15770.9","timeStamp":1531192827982},
                    {"sensorType":"light","value":"4896","timeStamp":1531192827989},
                    {"sensorType":"sound","value":"15782.8","timeStamp":1531192828086},
                    {"sensorType":"sound","value":"15792.5","timeStamp":1531192828188},
                    {"sensorType":"light","value":"4544","timeStamp":1531192828195},
                    {"sensorType":"sound","value":"15793.3","timeStamp":1531192828289},
                    {"sensorType":"sound","value":"15794.9","timeStamp":1531192828393},
                    {"sensorType":"light","value":"4528","timeStamp":1531192828399},
                    {"sensorType":"sound","value":"15781.9","timeStamp":1531192828495},
                    {"sensorType":"temperature","value":"18.9697","timeStamp":1531192828518},
                    {"sensorType":"sound","value":"15789.7","timeStamp":1531192828597},
                    {"sensorType":"light","value":"4832","timeStamp":1531192828602},
                    {"sensorType":"sound","value":"15786.3","timeStamp":1531192828696},
                    {"sensorType":"sound","value":"15776.6","timeStamp":1531192828800},
                    {"sensorType":"light","value":"4560","timeStamp":1531192828805},
                    {"sensorType":"sound","value":"15749.7","timeStamp":1531192828900},
                    {"sensorType":"sound","value":"15800.0","timeStamp":1531192829006},
                    {"sensorType":"light","value":"4560","timeStamp":1531192829009},
                    {"sensorType":"sound","value":"15784.2","timeStamp":1531192829106},
                    {"sensorType":"sound","value":"15809.1","timeStamp":1531192829209},
                    {"sensorType":"light","value":"4976","timeStamp":1531192829213},
                    {"sensorType":"sound","value":"15803.0","timeStamp":1531192829312},
                    {"sensorType":"sound","value":"15803.9","timeStamp":1531192829414},
                    {"sensorType":"light","value":"4768","timeStamp":1531192829420},
                    {"sensorType":"sound","value":"15779.4","timeStamp":1531192829518},
                    {"sensorType":"temperature","value":"18.037","timeStamp":1531192829526},
                    {"sensorType":"sound","value":"15787.4","timeStamp":1531192829618},
                    {"sensorType":"light","value":"5664","timeStamp":1531192829624},
                    {"sensorType":"sound","value":"15777.0","timeStamp":1531192829724},
                    {"sensorType":"sound","value":"15750.7","timeStamp":1531192829826},
                    {"sensorType":"light","value":"4848","timeStamp":1531192829830},
                    {"sensorType":"sound","value":"15794.5","timeStamp":1531192829929},
                    {"sensorType":"sound","value":"15802.6","timeStamp":1531192830031},
                    {"sensorType":"light","value":"4768","timeStamp":1531192830036},
                    {"sensorType":"sound","value":"15804.1","timeStamp":1531192830136},
                    {"sensorType":"sound","value":"15783.3","timeStamp":1531192830236},
                    {"sensorType":"light","value":"4512","timeStamp":1531192830242},
                    {"sensorType":"sound","value":"15787.8","timeStamp":1531192830338},
                    {"sensorType":"sound","value":"15757.4","timeStamp":1531192830442},
                    {"sensorType":"light","value":"4848","timeStamp":1531192830446},
                    {"sensorType":"temperature","value":"19.9268","timeStamp":1531192830530},
                    {"sensorType":"sound","value":"15796.9","timeStamp":1531192830548},
                    {"sensorType":"sound","value":"15795.4","timeStamp":1531192830650},
                    {"sensorType":"light","value":"4784","timeStamp":1531192830656},
                    {"sensorType":"sound","value":"15799.0","timeStamp":1531192830756},
                    {"sensorType":"sound","value":"15802.8","timeStamp":1531192830856},
                    {"sensorType":"light","value":"4880","timeStamp":1531192830862},
                    {"sensorType":"sound","value":"15788.5","timeStamp":1531192830958},
                    {"sensorType":"sound","value":"15799.9","timeStamp":1531192831060},
                    {"sensorType":"light","value":"4912","timeStamp":1531192831065},
                    {"sensorType":"sound","value":"15776.7","timeStamp":1531192831164},
                    {"sensorType":"sound","value":"15765.4","timeStamp":1531192831268},
                    {"sensorType":"light","value":"4176","timeStamp":1531192831271},
                    {"sensorType":"sound","value":"15794.4","timeStamp":1531192831367},
                    {"sensorType":"sound","value":"15781.8","timeStamp":1531192831472},
                    {"sensorType":"light","value":"4896","timeStamp":1531192831479},
                    {"sensorType":"temperature","value":"19.9055","timeStamp":1531192831532},
                    {"sensorType":"sound","value":"15792.0","timeStamp":1531192831573},
                    {"sensorType":"sound","value":"15782.1","timeStamp":1531192831679},
                    {"sensorType":"light","value":"4160","timeStamp":1531192831684},
                    {"sensorType":"sound","value":"15797.4","timeStamp":1531192831779},
                    {"sensorType":"sound","value":"15789.5","timeStamp":1531192831886},
                    {"sensorType":"light","value":"5280","timeStamp":1531192831887},
                    {"sensorType":"sound","value":"15781.2","timeStamp":1531192831981},
                    {"sensorType":"sound","value":"15800.8","timeStamp":1531192832086},
                    {"sensorType":"light","value":"4192","timeStamp":1531192832091},
                    {"sensorType":"sound","value":"15791.5","timeStamp":1531192832188},
                    {"sensorType":"sound","value":"15760.7","timeStamp":1531192832293},
                    {"sensorType":"light","value":"4128","timeStamp":1531192832299},
                    {"sensorType":"sound","value":"15788.5","timeStamp":1531192832398},
                    {"sensorType":"sound","value":"15781.6","timeStamp":1531192832501},
                    {"sensorType":"light","value":"5088","timeStamp":1531192832506},
                    {"sensorType":"temperature","value":"20.332","timeStamp":1531192832533},
                    {"sensorType":"sound","value":"15810.8","timeStamp":1531192832601},
                    {"sensorType":"sound","value":"15781.0","timeStamp":1531192832705},
                    {"sensorType":"light","value":"5088","timeStamp":1531192832711},
                    {"sensorType":"sound","value":"15777.9","timeStamp":1531192832807},
                    {"sensorType":"sound","value":"15783.3","timeStamp":1531192832909},
                    {"sensorType":"light","value":"4832","timeStamp":1531192832914},
                    {"sensorType":"sound","value":"15776.4","timeStamp":1531192833013},
                    {"sensorType":"sound","value":"15773.9","timeStamp":1531192833116},
                    {"sensorType":"light","value":"4864","timeStamp":1531192833121},
                    {"sensorType":"sound","value":"15806.6","timeStamp":1531192833220},
                    {"sensorType":"sound","value":"15788.3","timeStamp":1531192833320},
                    {"sensorType":"light","value":"4880","timeStamp":1531192833326},
                    {"sensorType":"sound","value":"15800.9","timeStamp":1531192833424},
                    {"sensorType":"sound","value":"15779.3","timeStamp":1531192833525},
                    {"sensorType":"light","value":"4864","timeStamp":1531192833530},
                    {"sensorType":"temperature","value":"20.14","timeStamp":1531192833539},
                    {"sensorType":"sound","value":"15781.0","timeStamp":1531192833631},
                    {"sensorType":"sound","value":"15789.0","timeStamp":1531192833754},
                    {"sensorType":"light","value":"5184","timeStamp":1531192833754},
                    {"sensorType":"sound","value":"15794.2","timeStamp":1531192833835},
                    {"sensorType":"sound","value":"15794.5","timeStamp":1531192833936},
                    {"sensorType":"light","value":"5296","timeStamp":1531192833941},
                    {"sensorType":"sound","value":"15799.1","timeStamp":1531192834039},
                    {"sensorType":"sound","value":"15824.3","timeStamp":1531192834139},
                    {"sensorType":"light","value":"4848","timeStamp":1531192834145},
                    {"sensorType":"sound","value":"15797.5","timeStamp":1531192834243},
                    {"sensorType":"sound","value":"15771.0","timeStamp":1531192834346},
                    {"sensorType":"light","value":"4864","timeStamp":1531192834351},
                    {"sensorType":"sound","value":"15797.1","timeStamp":1531192834450},
                    {"sensorType":"temperature","value":"17.5927","timeStamp":1531192834540},
                    {"sensorType":"sound","value":"15780.5","timeStamp":1531192834555},
                    {"sensorType":"light","value":"4832","timeStamp":1531192834560},
                    {"sensorType":"sound","value":"15793.8","timeStamp":1531192834653},
                    {"sensorType":"sound","value":"15793.3","timeStamp":1531192834755},
                    {"sensorType":"light","value":"5664","timeStamp":1531192834760},
                    {"sensorType":"sound","value":"15786.4","timeStamp":1531192834855},
                    {"sensorType":"sound","value":"15795.8","timeStamp":1531192834958},
                    {"sensorType":"light","value":"5296","timeStamp":1531192834963},
                    {"sensorType":"sound","value":"15804.7","timeStamp":1531192835062},
                    {"sensorType":"sound","value":"15787.4","timeStamp":1531192835167},
                    {"sensorType":"light","value":"4896","timeStamp":1531192835172},
                    {"sensorType":"sound","value":"15800.9","timeStamp":1531192835269},
                    {"sensorType":"sound","value":"15768.8","timeStamp":1531192835373},
                    {"sensorType":"light","value":"4848","timeStamp":1531192835379},
                    {"sensorType":"sound","value":"15792.4","timeStamp":1531192835478},
                    {"sensorType":"temperature","value":"20.204","timeStamp":1531192835543},
                    {"sensorType":"sound","value":"15785.5","timeStamp":1531192835580},
                    {"sensorType":"light","value":"4848","timeStamp":1531192835586},
                    {"sensorType":"sound","value":"15816.2","timeStamp":1531192835684},
                    {"sensorType":"sound","value":"15763.5","timeStamp":1531192835789},
                    {"sensorType":"light","value":"4768","timeStamp":1531192835794},
                    {"sensorType":"sound","value":"15790.5","timeStamp":1531192835891},
                    {"sensorType":"sound","value":"15781.3","timeStamp":1531192835992},
                    {"sensorType":"light","value":"4912","timeStamp":1531192835998},
                    {"sensorType":"sound","value":"15793.3","timeStamp":1531192836097},
                    {"sensorType":"sound","value":"15781.1","timeStamp":1531192836199},
                    {"sensorType":"light","value":"4896","timeStamp":1531192836204},
                    {"sensorType":"sound","value":"15834.2","timeStamp":1531192836303},
                    {"sensorType":"sound","value":"15797.3","timeStamp":1531192836405},
                    {"sensorType":"light","value":"4864","timeStamp":1531192836409},
                    {"sensorType":"sound","value":"15796.1","timeStamp":1531192836506},
                    {"sensorType":"temperature","value":"19.9907","timeStamp":1531192836544},
                    {"sensorType":"sound","value":"15807.8","timeStamp":1531192836608},
                    {"sensorType":"light","value":"5040","timeStamp":1531192836613},
                    {"sensorType":"sound","value":"15792.4","timeStamp":1531192836711},
                    {"sensorType":"sound","value":"15786.5","timeStamp":1531192836814},
                    {"sensorType":"light","value":"4864","timeStamp":1531192836819},
                    {"sensorType":"sound","value":"15772.6","timeStamp":1531192836918},
                    {"sensorType":"sound","value":"15784.3","timeStamp":1531192837020},
                    {"sensorType":"light","value":"4832","timeStamp":1531192837024},
                    {"sensorType":"sound","value":"15786.8","timeStamp":1531192837121},
                    {"sensorType":"sound","value":"15767.3","timeStamp":1531192837223},
                    {"sensorType":"light","value":"4576","timeStamp":1531192837228}];

function updateGraph() {
    let ringBuffer = remote.getGlobal('ringBuffer');
    // console.log("ringBuffer", ringBuffer);
    Plotly.react('graph', getData(ringBuffer), graphLayout);
}

function drawGraph() {
    let startTime = new Date(Date.now() + 3000);

    var j = schedule.scheduleJob({ start: startTime, rule: '*/1 * * * * *' }, function () { 
        //  that pattern is once a second
        updateGraph();
    });
}

//show the graph with dummy data so that the update has something to update.
Plotly.plot('graph', getData(emptyData), graphLayout);
drawGraph();

window.onresize = function() {
    let g = document.getElementById('graph');
    Plotly.relayout('graph', {
        width: g.offsetWidth,
        height: g.offsetHeight
        });
    console.log("resized the graph");
};
