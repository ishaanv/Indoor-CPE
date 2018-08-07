import datetime as dt
import json
import time

import serial
import re

# setup serial port
# on windows check serial port in device manager->ports->COMX
ser = serial.Serial(
    '/dev/ttyACM0',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1)

while True:
	print(ser.readline())
