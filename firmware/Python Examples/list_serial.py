def _list_serial_ports(self):
        """ This function is taken from Stackoverflow and will list all serial ports"""
        """Lists serial ports
    
        :raises EnvironmentError:
            On unsupported or unknown platforms
        :returns:
            A list of available serial ports
        """
        if sys.platform.startswith('win'):
            ports = ['COM' + str(i + 1) for i in range(256)]
    
        elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
            # this is to exclude your current terminal "/dev/tty"
            ports = glob.glob('/dev/tty[A-Za-z]*')
    
        elif sys.platform.startswith('darwin'):
            ports = glob.glob('/dev/tty.*')
    
        else:
            raise EnvironmentError('Unsuppteorted platform')
    
        result = []
        for port in ports:
            try:
                s = serial.Serial(port)
                s.close()
                result.append(port)
            except (OSError, serial.SerialException):
                pass
        return result
if __name__ == 