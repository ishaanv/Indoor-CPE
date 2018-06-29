ringBuffer = [];
var data = 'sound: 12.6536098';

function decodeData(d) {
	d = d.split(': ');
	sensorType = d[0];
	value = d[1];
	return {
		sensorType: sensorType,
		value: value,
		timeStamp: Date.now(),
	};
}

function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}

function appendToRing(newData, timeToKeepMS) {
  ringBuffer.push(newData);
  timeNow = newData.timeStamp;
  cutoffTime = timeNow - timeToKeepMS;
  x = ringBuffer.filter(d => d.timeStamp > cutoffTime);
  ringBuffer = x; // WILL SOMEONE PLEASE EXPLAIN THIS TO ME?
  // This is O(n), that's probably fine for small arrays. If perf
  // becomes an issue then we could loop from the tail and break
  // once we reach a value that we should keep.
}


for (i = 0; i < 100; ++i) {
	d = decodeData(data);
	appendToRing(d, 160);
	wait(50) //ms
}

console.log(ringBuffer);


// ringbuffer = ringBuffer.filter(d => d.timeStamp > cutoffTime);
