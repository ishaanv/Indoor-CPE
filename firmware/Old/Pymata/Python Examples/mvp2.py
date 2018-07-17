#!/usr/bin/python
import time
import sys

from numpy import interp
from numpy import mean
import threading
import math
import signal

import array
import math

from collections import deque
d = deque(maxlen=15)
colour = deque(maxlen=2)
flag = True

from queue import Queue
# Import CircuitPlayground class from the circuitplayground.py in the same directory.
from circuitplayground_edit import CircuitPlayground

# # Grab the serial port from the command line parameters.
# if len(sys.argv) != 2:
#     print('ERROR! Must specify the serial port as command line parameter.')
#     sys.exit(-1)
# port = sys.argv[1]
port = "COM7"

# Connect to Circuit Playground board on specified port.
board = CircuitPlayground(port)


# Define function that will be called when data is received from the light sensor.
def light_data(data):
    # Print out the raw light sensor ADC value (data[2] holds the value).
    d.append('l' + str(data[2]))
    time.sleep(0.1)
    # print('Light sensor: {0}'.format(data[2]))


# Define function that will be called when data is received from the microphone.
def sound_data(data):
    # Print out the raw microphone ADC value (data[2] holds the value).
    d.append('s' + str(data[2]))
    time.sleep(0.1)
    # print('Microphone: {0:.2f}'.format(data[2]))


# pass a callback function that will be called when a new
# temperature measurement is available.  This function should take two
# parameters, the temp in celsius and the raw ADC value.  See the commented
# code below:
def new_temp(temp_c, raw):
    d.append('t' + str(temp_c))
    time.sleep(0.5)
    # print('Temperature: {0:.2f} Celsius'.format(temp_c))
    # time.sleep(0.5)


board.start_temperature(new_temp)

# Setup Firmata to listen to light sensor analog input (A5).
# The callback function will be called whenever new data is available.
board.set_pin_mode(5, board.INPUT, board.ANALOG, light_data)

# Setup Firmata to listen to the microphone analog input (A4):
# The callback functions will be called whenever new data is available.
board.set_pin_mode(4, board.INPUT, board.ANALOG, sound_data)

# Adjust the brightness of all the pixels by calling set_pixel_brightness.
# Send a value from 0 - 100 which means dark to full bright.
# Note that if you go down to 0 brightness you won't be able to go back up
# to higher brightness because the color information is 'lost'.  It's best to
# just call set brightness once at the start to set a good max brightness instead
# of trying to make animations with it.
board.set_pixel_brightness(50)

SENSOR = ['s', 't', 'l']
current_sense = 'l'


def sense_change(current_sense):
    current_sense = (current_sense + 1) % len(SENSOR)


# Setup Firmata to listen to button changes.
# The buttons/switches on Circuit Playground use these pins:
#  - Left button = Digital pin 4
#  - Right button = Digital pin 19
board.set_pin_mode(4, board.INPUT, board.DIGITAL, sense_change)

# board.set_pin_mode(19, board.INPUT, board.DIGITAL, right_changed)


# old_colour = (0,0,0)
def pixelThread():
    '''
    set all neopixels to colour
    colour is the 8 bit colour value tuple to show on all pixels
    e.g (255,0,0)
    '''

    for i in range(10):
        board.set_pixel(i, colour[0][0], colour[0][1], colour[0][2])
    board.show_pixels()
    threading.Timer(1, pixelThread).start()
    # old_colour = colour


try:
    print_flag = 0
    pixel_cnt = 0
    colour_list = []
    colour.append([255, 0, 0])
    # thread = threading.Thread(target=pixelThread, args=())
    pixelThread()
    # thread.start()
    # thread.join()
    while True:
        # Calibrate inital values
        # sound_data(data)
        if d:
            print(d)
            print(colour)
            pixel_cnt = (pixel_cnt + 1) % 3
            colour_list = [0, 0, 0]
            colour_list[pixel_cnt] = 255
            colour.append(colour_list)
            time.sleep(0.5)
        elif print_flag < 100:
            # print("deque is empty")
            print_flag += 1
            if print_flag == 100:
                print("unsucceful startup")

except Exception as e:
    print(e)
