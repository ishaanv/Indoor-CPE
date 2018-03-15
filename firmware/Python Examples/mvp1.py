#!/usr/bin/python
import time
import sys
import multiprocessing
import math
from queue import Queue
# Import CircuitPlayground class from the circuitplayground.py in the same directory.
from circuitplayground_edit import CircuitPlayground


# Grab the serial port from the command line parameters.
# if len(sys.argv) != 2:
#     print('ERROR! Must specify the serial port as command line parameter.')
#     sys.exit(-1)
# port = sys.argv[1]
port = "COM6"

# Connect to Circuit Playground board on specified port.
board = CircuitPlayground(port)

# Define function that will be called when data is received from the light sensor.
def light_data(data):
    # Print out the raw light sensor ADC value (data[2] holds the value).
    print('Light sensor: {0}'.format(data[2]))

# Define function that will be called when data is received from the microphone.
def sound_data(data):
    # Print out the raw microphone ADC value (data[2] holds the value).
    print('Microphone: {0:.2f}'.format(data[2]))

# pass a callback function that will be called when a new
# temperature measurement is available.  This function should take two
# parameters, the temp in celsius and the raw ADC value.  See the commented
# code below:
def new_temp(temp_c, raw):
    print('Temperature: {0:.2f} Celsius'.format(temp_c))
    # print('TEST: {} !!!!!!!'.format(test))
    time.sleep(0.5)
    # print('Raw thermistor ADC value: {0}'.format(raw))

board.start_temperature(new_temp)

# Setup Firmata to listen to light sensor analog input (A5).
# The callback function will be called whenever new data is available.
board.set_pin_mode(5, board.INPUT, board.ANALOG, light_data)

# Setup Firmata to listen to the microphone analog input (A4):
# The callback functions will be called whenever new data is available.
board.set_pin_mode(4, board.INPUT, board.ANALOG, sound_data)

# ---- pixels

# List of color gradients.  Each entry is a 2-tuple of RGB colors.
COLORS = [((255, 0, 0), (0, 0, 0)), ((0, 255, 0), (0, 0, 0)),
          ((0, 0, 255), (0, 0, 0)), ((255, 0, 0), (0, 255, 0)),
          ((255, 0, 0), (0, 0, 255)), ((0, 255, 0), (0, 0, 255))]

COLORS2 = [(255, 0, 0), (0, 255, 0), (0, 0, 255),
          (255, 255, 0),(0, 255, 255),(255, 0, 255),
          (255,255,255),(0 ,0, 0)]

# List of frequency values for the animation.  Higher values are faster
# animations (this goes directly into the sine wave computation).
FREQUENCIES = [0.25, 0.5, 1, 2]

# Global amimation state, the currently selected color combo (index into colors)
# and the frequency of the aninmation (index into frequencies).
current_color = 0
current_frequency = 0


# Linear interpolation of a value y within y0...y1 given x and range x0...x1.
def lerp(x, x0, x1, y0, y1):
    return y0 + (x - x0) * ((y1 - y0) / (x1 - x0))


# Define functions that will be called when the buttons change state.
def left_changed(data):
    global current_color
    if not data[2]:
        # Move to the next color when button is released.
        current_color = (current_color + 1) % len(COLORS2)


def right_changed(data):
    global current_frequency
    if not data[2]:
        # Move to the next frequency when button is released.
        current_frequency = (current_frequency + 1) % len(FREQUENCIES)

# Adjust the brightness of all the pixels by calling set_pixel_brightness.
# Send a value from 0 - 100 which means dark to full bright.
# Note that if you go down to 0 brightness you won't be able to go back up
# to higher brightness because the color information is 'lost'.  It's best to
# just call set brightness once at the start to set a good max brightness instead
# of trying to make animations with it.
board.set_pixel_brightness(50)

# Setup Firmata to listen to button changes.
# The buttons/switches on Circuit Playground use these pins:
#  - Left button = Digital pin 4
#  - Right button = Digital pin 19
board.set_pin_mode(4, board.INPUT, board.DIGITAL, left_changed)
board.set_pin_mode(19, board.INPUT, board.DIGITAL, right_changed)


# # Create processes
# q = multiprocessing.Queue()


def neopixel_thread():
    frequency = FREQUENCIES[current_frequency]
    c0_red, c0_green, c0_blue = COLORS[current_color][0]
    c1_red, c1_green, c1_blue = COLORS[current_color][1]
    t = time.time()
    # Go through each pixel and interpolate its color using a sine wave with
    # phase offset based on pixel position.
    for i in range(10):
        phase = (i / 10.0) * 2.0 * math.pi
        x = math.sin(2.0 * math.pi * frequency * t + phase)
        red = int(lerp(x, -1.0, 1.0, c0_red, c1_red))
        green = int(lerp(x, -1.0, 1.0, c0_green, c1_green))
        blue = int(lerp(x, -1.0, 1.0, c0_blue, c1_blue))
        # Set the pixel color.
        board.set_pixel(i, red, green, blue)
    # Push the updated colors out to the pixels (this will make the pixels change
    # their color, the previous set_pixel calls just change the memory and not
    # the pixels).
    board.show_pixels()

    time.sleep(0.01)

def neopixel_simple():
    red, green, blue = COLORS2[current_color]
    for i in range(10):
        board.set_pixel(i, red, green, blue)

    board.show_pixels()


# thread = Thread(target=neopixel_thread, args=(10, ))
# thread.start()
# thread.join()

while (True):
    neopixel_simple()
    time.sleep(1)  # Do nothing and just sleep.  When data is available the callback
    # functions above will be called.
