import serial
import time

import re

ser = serial.Serial('COM12', 
                    baudrate = 115200,
                    parity=serial.PARITY_NONE,
                    stopbits=serial.STOPBITS_ONE,
                    bytesize=serial.EIGHTBITS,
                    timeout=1
                    )


print(ser)
i = 0
while True:
    # send = input("input:")
    # x = ser.readline()
    # ser.write((str(i)+'\r\n').encode())
    line = str(ser.readline())
    if 'sound' in line:
        sound = re.findall("\d+\.\d+",line)
        print(sound[0])

    elif 't:' in line:
        temp = re.findall("\d+\.\d+",line)
        print(temp[0])
    elif 'l:' in line:
        light = re.findall("\d+\.\d+",line)
        print(light[0])



    i += 1
    # time.sleep(1)
    # print(ser.readable())import time
