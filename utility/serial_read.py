import serial.tools.list_ports
import serial

ports = list(serial.tools.list_ports.comports())
for p in ports:
    if "Circuit" in p.description:
        """
        Changes on systems:
        either "Adafruit Circuit Playground Express" (windows)
        OR
        "CircuitPlayground Express" (rpi)

        see: https://pythonhosted.org/pyserial/tools.html#serial.tools.list_ports.ListPortInfo
        for documentation on comports objects
        """
        CPE = p
        CPE_ID = [p.vid, p.pid]
        # use port for loading serial data
        CPEport = p.device
        print(CPEport)


# setup serial port
# on windows check serial port in device manager->ports->COMX
ser = serial.Serial(
    CPEport,
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1)

# reload the firmware
ser.write(b'\x03')
ser.write(b'\x04')

while True:
    print(ser.readline())
