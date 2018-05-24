import serial

ser = serial.Serial('COM3', baudrate=115200)
print(ser)

ser.write(b'd\n')