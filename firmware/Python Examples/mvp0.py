#!/usr/bin/python
import time
import sys





# Import CircuitPlayground class from the circuitplayground.py in the same directory.
from circuitplayground_edit import CircuitPlayground


# Grab the serial port from the command line parameters.
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
    time.sleep(0.1)
    # print('Raw thermistor ADC value: {0}'.format(raw))

board.start_temperature(new_temp)

# Setup Firmata to listen to light sensor analog input (A5).
# The callback function will be called whenever new data is available.
board.set_pin_mode(5, board.INPUT, board.ANALOG, light_data)

# Setup Firmata to listen to the microphone analog input (A4):
# The callback functions will be called whenever new data is available.
board.set_pin_mode(4, board.INPUT, board.ANALOG, sound_data)

# Setup Firmata to listen to button changes.
# The buttons/switches on Circuit Playground use these pins:
#  - Left button = Digital pin 4
#  - Right button = Digital pin 19
board.set_pin_mode(4, board.INPUT, board.DIGITAL)
board.set_pin_mode(19, board.INPUT, board.DIGITAL)

j = 0
while (True):
    for i in range(10):
        board.set_pixel(i,(j*28)%255,(j*28)%128,0)
    board.show_pixels()
    if j < 10:
        j += 1
    else:
        j = 0
    time.sleep(1)  # Do nothing and just sleep.  When data is available the callback
    # functions above will be called.