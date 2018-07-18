import serial
# setup serial port
# on windows check serial port in device manager->ports->COMX
ser = serial.Serial(
    'COM11',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1)
ser.write(b'\x03')
ser.write(b'\x04')
