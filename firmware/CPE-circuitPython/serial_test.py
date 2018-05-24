import serial
import time

ser = serial.Serial('COM3', 
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
    ser.write(b'd')
    i += 1
    time.sleep(1)
    # print(ser.readable())import time
