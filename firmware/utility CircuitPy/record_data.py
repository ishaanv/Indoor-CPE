import datetime as dt
import json
import time

import serial
import re

# setup serial port
# on windows check serial port in device manager->ports->COMX
ser = serial.Serial(
    'COM12',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1)

data = {"temperature": [], "soundVolume": []}

# record for 10 mins
now = time.time()
mins = 10
future = now + mins * 60
while time.time() < future:

    line = str(ser.readline())
    if 'sound' in line:
        sound = re.findall("\d+\.\d+", line)
        data["soundVolume"].append({
            "time": dt.datetime.now().isoformat(),
            "value": sound[0]
        })

    elif 't:' in line:
        temp = re.findall("\d+\.\d+", line)
        data["temperature"].append({
            "time": dt.datetime.now().isoformat(),
            "value": temp[0]
        })
        print(temp[0])
    elif 'l:' in line:
        light = re.findall("\d+\.\d+", line)
        # print(light[0])
    if (future - time.time()) % 60 == 0:
        print(time.time())

with open("shim.json", 'w') as fp:
    json.dump(data, fp)
