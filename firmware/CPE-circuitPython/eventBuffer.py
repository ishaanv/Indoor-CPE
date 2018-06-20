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
# pixels.fill(0)
# pixels.show()

filename = 'buffer.txt'
colour = [0,0,0]
j = 0

while True:
	f = os.stat(filename)
	fsize = f[6]
	
	

	if fsize > 0:
		with open('/buffer.txt','r') as fr:#, open('/buffer.txt', 'w') as fw:
			lines = fr.readlines()
			if len(lines) > 0:
				# print(lines[0]) 
				colour[0] = int(lines[0][:2],16)
				colour[1] = int(lines[0][2:4],16)
				colour[2] = int(lines[0][4:],16)
				
		for i in range(10):
			pixels[i] = colour
			pixels.show()
		# send current pixel colour until windows destructive reads
		print(pixels.__getitem__(0))
		j = 1
	elif fsize == 0 and j == 1:
		print("empty")
		j = 0



	# print("TTTT {}".format(thermistor.temperature))
	# time.sleep(1)

# def pop(filename, n):
# 	f = os.stat(filename)
# 	fsize = f[6]
# 	n = fsize//7

# 	with open(filename, 'w') as fd:
# 		n = int(n)
# 		fd.writelines(rows[n:])
# 		return ''.join(rows[:n])