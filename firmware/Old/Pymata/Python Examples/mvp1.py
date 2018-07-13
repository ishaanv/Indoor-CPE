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
d = deque(maxlen=30)
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
    if flag:
        d.append('l' + str(data[2]))
    # print('Light sensor: {0}'.format(data[2]))


# Define function that will be called when data is received from the microphone.
def sound_data(data):
    # Print out the raw microphone ADC value (data[2] holds the value).
    if flag:
        d.append('s' + str(data[2]))
    # print('Microphone: {0:.2f}'.format(data[2]))


# pass a callback function that will be called when a new
# temperature measurement is available.  This function should take two
# parameters, the temp in celsius and the raw ADC value.  See the commented
# code below:
def new_temp(temp_c, raw):
    if flag:
        d.append('t' + str(temp_c))
    # print('Temperature: {0:.2f} Celsius'.format(temp_c))
    # print('TEST: {} !!!!!!!'.format(test))

    # time.sleep(0.5)
    # print('Raw thermistor ADC value: {0}'.format(raw))


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


def wheel(pos):
    # Input a value 0 to 255 to get a color value.
    # The colours are a transition r - g - b - back to r.
    if (pos < 0) or (pos > 255):
        return (0, 0, 0)
    if (pos < 85):
        return (int(pos * 3), int(255 - (pos * 3)), 0)
    elif (pos < 170):
        pos -= 85
        return (int(255 - pos * 3), 0, int(pos * 3))
    else:
        pos -= 170
        return (0, int(pos * 3), int(255 - pos * 3))


def rainbow_cycle(wait):
    for j in range(255 * 6):  # 6 cycles of all colors on wheel
        for r in range(10):
            idx = int((r * 255 / 10) + j)
            board.set_pixel(wheel(idx & 255), 0, 0, 0)
        board.show_pixels()
        time.sleep(wait)


# thread = threading.Thread(target=neopixel_thread, args=(10, ))
# t.daemon = True # die when the main thread dies
# t.start()
# q = Queue()

# thread.start()
# thread.join()
try:
    while (True):
        # Calibrate inital values
        # sound_data(data)
        if d and True:
            # print(d)
            d2 = d.copy()
            sensor_data = [
                d2[i][1:] for i in range(len(d2)) if d2[i][0] == current_sense
            ]
            if current_sense == 's' and flag:
                sensor_data = list(map(int, sensor_data))
                numpixs = round(interp(mean(sensor_data), [60, 80], [0, 9]))
                numpixs = 9
                for i in range(numpixs):
                    board.set_pixel(i, 255, 0, 0)
                print(sensor_data)

            elif current_sense == 't' and flag:
                sensor_data = list(map(float, sensor_data))
                # round(interp(mean(sensor_data), [1, 512], [0, 9]))
                for i in range(10):
                    board.set_pixel(i, 0, 255, 0)

            elif current_sense == 'l' and flag:
                sensor_data = list(map(int, sensor_data))
                numpixs = round(interp(sensor_data[0], [0, 4096], [0, 10]))
                for i in range(numpixs):
                    board.set_pixel(i, 0, 255, 0)
                for i in range(numpixs, 10):
                    board.set_pixel(i, 0, 0, 0)
                print(sensor_data)
            else:
                rainbow_cycle(0.005)

            board.show_pixels()
        else:
            rainbow_cycle(0.005)
        # time.sleep(1)  # Do nothing and just sleep.  When data is available the callback
        # functions above will be called.
except Exception as e:
    for i in range(10):
        board.set_pixel(i, 0, 0, 0)
    board.show_pixels()
    sys.exit(0)
