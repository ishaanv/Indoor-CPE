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
import samd
# from adafruit_circuitplayground.express import cpx

samd.disable_autoreload()

NUM_SAMPLES = 50
NUM_PIXELS = 10


buffername = 'buffer.txt'
colour = [0, 0, 0]
j = 0

interval_sound = 0.1
interval_analog = 1
interval_pixel = 0.1
last = time.monotonic()
light_last = last
temp_last = last
sound_last = last
neopixel_last = last

pixels = neopixel.NeoPixel(board.NEOPIXEL, NUM_PIXELS,
                           brightness=1, auto_write=False)
thermistor = adafruit_thermistor.Thermistor(
    board.TEMPERATURE, 11371.93, 10000, 25, 3950)
light = AnalogIn(board.LIGHT)

# Remove DC bias before computing RMS.
def normalized_rms(values):
    minbuf = int(mean(values))
    return math.sqrt(sum(float((sample-minbuf)*(sample-minbuf)) for sample in values)/len(values))

def mean(values):
    return (sum(values) / len(values))
mic = audiobusio.PDMIn(board.MICROPHONE_CLOCK, board.MICROPHONE_DATA, frequency=16000, bit_depth=16)

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

			for i in range(NUM_PIXELS):
				pixels[i] = colour
				pixels.show()

			# send current pixel colour until windows destructive reads
			N = pixels.__getitem__(0)
			serial("N{}{}{}".format(N[0], N[1], N[2]))		
	return last

# Record an initial sample to calibrate. Assume it's quiet when we start.
samples = array.array('H', [0] * NUM_SAMPLES)
mic.record(samples, len(samples))

# Set lowest level to expect, plus a little.
input_floor = normalized_rms(samples) + 10


while True:
	now = time.monotonic()
	fsize = os.stat(buffername)[6]

	light_last = analog_serial(light.value, interval_analog, now, light_last)
	temp_last = analog_serial(thermistor.temperature, interval_analog, now, temp_last)
	sound_last = sound_serial(mic, samples, interval_sound, now, sound_last)
	neopixel_last = neopixel_control(
	    fsize, '/buffer.txt', interval_pixel, now, neopixel_last)
	