import array
import audiobusio
import board
import math
import neopixel
import time
import sys
import microcontroller
import digitalio

import adafruit_thermistor
import board
import time
from analogio import AnalogIn

import storage
import os

import samd
samd.disable_autoreload()


NUM_PIXELS = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, NUM_PIXELS, brightness=1, auto_write=False)


thermistor = adafruit_thermistor.Thermistor(board.TEMPERATURE, 11371.93, 10000, 25, 3950)
analogin = AnalogIn(board.LIGHT)

NUM_SAMPLES = 200
# Remove DC bias before computing RMS.
def normalized_rms(values):
    minbuf = int(mean(values))
    return math.sqrt(sum(float((sample-minbuf)*(sample-minbuf)) for sample in values)/len(values))

def mean(values):
    return (sum(values) / len(values))
mic = audiobusio.PDMIn(board.MICROPHONE_CLOCK, board.MICROPHONE_DATA, frequency=16000, bit_depth=16)
# Record an initial sample to calibrate. Assume it's quiet when we start.
samples = array.array('H', [0] * NUM_SAMPLES)
mic.record(samples, len(samples))

# Set lowest level to expect, plus a little.
input_floor = normalized_rms(samples) + 10


filename = 'buffer.txt'
colour = [0,0,0]
j = 0


interval_sound = 0.1
interval_analog = 1
interval_pixel = 0.1
last = time.monotonic()
last1 = last
last2 = last
last3 = last



while True:
	now = time.monotonic()
	f = os.stat(filename)
	fsize = f[6]
	print(time.monotonic() - now)
	
	
	if abs(last1 - now) > interval_analog:
		print("temp: {}\nlight: {}".format(thermistor.temperature,
											analogin.value))
	    last1 = now
	if abs(last2 - now) > interval_sound:
	    mic.record(samples, len(samples))
	    magnitude = normalized_rms(samples)
	    print("sound: {}".format(magnitude))
	    last2 = now
	if abs(last3 - now) > interval_pixel:

		if fsize > 0:
			with open('/buffer.txt','r') as fr:
				lines = fr.readlines()
				if len(lines) > 0:
					#READ FIRST LINE FOR NOW
					colour[0] = int(lines[0][:2],16)
					colour[1] = int(lines[0][2:4],16)
					colour[2] = int(lines[0][4:],16)
					
			for i in range(10):
				pixels[i] = colour
				pixels.show()
			# send current pixel colour until windows destructive reads
			N = pixels.__getitem__(0)
			print("N{}{}{}".format(N[0],N[1],N[2]))
			j = 1
		elif fsize == 0 and j == 1:
			print("empty")
			j = 0

		last3 = now


