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
from analogio import AnalogIn

import storage
import os
import supervisor
# from adafruit_circuitplayground.express import cpx

supervisor.disable_autoreload()

import constants as c

colour = [0, 0, 0]

last = time.monotonic()
light_last = last
temp_last = last
sound_last = last
neopixel_last = last

pixels = neopixel.NeoPixel(board.NEOPIXEL, c.NUM_PIXELS,
                           brightness=1, auto_write=False)
thermistor = adafruit_thermistor.Thermistor(
    board.TEMPERATURE, c.RMEASURED, c.NOMINALRESISTOR, c.NOMINALTEMPERATURE, c.BETACOEF)
light = AnalogIn(board.LIGHT)

# Remove DC bias before computing RMS.
def normalized_rms(values):
    minbuf = int(mean(values))
    return math.sqrt(sum(float((sample-minbuf)*(sample-minbuf)) for sample in values)/len(values))

def mean(values):
    return (sum(values) / len(values))
mic = audiobusio.PDMIn(board.MICROPHONE_CLOCK, board.MICROPHONE_DATA, sample_rate=44100, bit_depth=16)

def serial(text):
	"""
	print serial value to serial port
	e.g. COM3
	Serial port must be configured at other end
	with baudrate = 115200
	"""
	print(text)


def analog_serial(value, sample_rate, now, last):
	if now - last > sample_rate:
		serial(value)
		last = now
		
	return last	

def sound_serial(mic, samples, sample_rate, now, last):
	if now - last > sample_rate:
		mic.record(samples, len(samples))
		magnitude = normalized_rms(samples)
		serial("sound: {}".format(magnitude))
		last = now
	return last


def neopixel_control(fsize, buffer_name, sample_rate, now, last):
	if now - last > sample_rate:
		last = now
		if fsize > 0:
			with open(buffer_name, 'r') as fr:
				lines = fr.readlines()
				if len(lines) > 0:
					#READ FIRST LINE FOR NOW
					colour[0] = int(lines[0][:2], 16)
					colour[1] = int(lines[0][2:4], 16)
					colour[2] = int(lines[0][4:], 16)

			for i in range(c.NUM_PIXELS):
				pixels[i] = colour
				pixels.show()

			# send current pixel colour until windows destructive reads
			N = pixels.__getitem__(0)
			serial("N{}{}{}".format(N[0], N[1], N[2]))		
	return last

# Record an initial sample to calibrate. Assume it's quiet when we start.
samples = array.array('H', [0] * c.NUM_SAMPLES)
mic.record(samples, len(samples))

# Set lowest level to expect, plus a little.
input_floor = normalized_rms(samples) + 10


while True:
	now = time.monotonic()
	fsize = os.stat(c.BUFFERNAME)[6]

	light_last = analog_serial(light.value, c.INTERVAL_LIGHT, now, light_last)
	temp_last = analog_serial(thermistor.temperature,
	                          c.INTERVAL_TEMPERATURE, now, temp_last)
	sound_last = sound_serial(mic, samples, c.INTERVAL_SOUND, now, sound_last)
	neopixel_last = neopixel_control(
	    fsize, c.BUFFERNAME, c.INTERVAL_PIXEL, now, neopixel_last)

