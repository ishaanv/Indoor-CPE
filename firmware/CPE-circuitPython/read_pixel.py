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

NUM_PIXELS = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, NUM_PIXELS, brightness=0.1, auto_write=False)
thermistor = adafruit_thermistor.Thermistor(board.TEMPERATURE, 11371.93, 10000, 25, 3950)
# pixels.fill(0)
# pixels.show()
colour = (0,0,0)
j = 0
while True:
	for i in range(10):
		pixels[i] = colour
	pixels.show()

	with open('/buffer.txt','r') as fr:#, open('/buffer.txt', 'w') as fw:
		lines = fr.readlines()
		if len(lines) > 0:
			print(lines[j]) 
			r = list(map(int,lines[j].split()))
			colour = (r[0],r[1],r[2])
			# del(lines[0])
			# fw.writelines(lines)
		# fw.writelines(lines)

	j = (j+1)%3
	# if j == 0:
	# 	colour = (255,0,0)
	# elif j == 1:
	# 	colour = (0,255,0)
	# elif j == 2:
	# 	colour = (0,0,255)

	print("TTTT {}".format(thermistor.temperature))
	# time.sleep(1)