#!/usr/bin/env python
"""
 Copyright (c) 2015-2017 Alan Yorinks All rights reserved.
 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 Version 3 as published by the Free Software Foundation; either
 or (at your option) any later version.
 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 General Public License for more details.
 You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
 along with this library; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
This example illustrates using callbacks for digital input, analog input and
analog latches, in addition to demonstrating both writing to an LED using PWM
and with digital outputs.
A switch is used to turn an LED on and off, and a potentiometer sets the
intensity of a second LED. When the potentiometer exceeds a raw value of
1000, the program is terminated.
"""
import time
import signal
import sys
import os

# from PyMata.pymata import PyMata
from circuitplayground_edit import CircuitPlayground

# Digital pins
GREEN_LED = 13

PUSH_BUTTON = 4

# Analog pin
POTENTIOMETER = 2

# Index to retrieve data from an analog or digital callback list
DATA_VALUE = 2

# Switch states
ON = 1
OFF = 0

# Indices for data list passed to latch callback
LATCH_TYPE = 0
LATCH_PIN = 1
LATCH_DATA_VALUE = 2
LATCH_TIME_STAMP = 3


# Callback functions
# Set the LED to current state of the pushbutton switch
def cb_push_button(data):
    os.kill(os.getpid(), signal.SIGSEGV)




# Create a PyMata instance
# board = PyMata("COM6", verbose=True)
board = CircuitPlayground("COM7")


def signal_handler(sig, frame):
    print('You pressed Ctrl+C')
    if board is not None:
        board.reset()
    sys.exit(0)

board.set_pixel_brightness(50)
def signal_pixel(sig, frame):
    if board is not None:
        for i in range(10):
            board.set_pixel(i, 255, 0, 0)

        board.show_pixels()
        time.sleep(1)

        for j in range(10):
            board.set_pixel(j, 0, 0, 0)
        board.show_pixels()
        # board.reset()


signal.signal(signal.SIGSEGV, signal_pixel)
# signal.signal(signal.SIGINT, signal_handler)


# Set pin modes
board.set_pin_mode(GREEN_LED, board.OUTPUT, board.DIGITAL)
board.set_pin_mode(PUSH_BUTTON, board.INPUT, board.DIGITAL, cb_push_button)
# board.set_pin_mode(19, board.INPUT, board.DIGITAL, sys.exit(0))


# Do nothing loop - program exits when latch data event occurs for
# potentiometer or timer expires
try:
    while True:
        print("I'm infinitely looping")
        time.sleep(1)
except:
    board.close()