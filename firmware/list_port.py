import serial.tools.list_ports
ports = list(serial.tools.list_ports.comports())
for p in ports:
    if "Circuit" in p.description:
        """
        Changes on systems:
        either "Adafruit Circuit Playground Express" (windows)
        OR
        "CircuitPlayground Express" (rpi)
        
        see: https://pythonhosted.org/pyserial/tools.html#serial.tools.list_ports.ListPortInfo
        for documentation 
        """
        CPE = p
        CPE_ID = [p.vid, p.pid]
        # use port for loading serial data
        CPEport = p.device
        print(CPEport)