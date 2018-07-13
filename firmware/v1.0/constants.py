import microcontroller
"""
Unique ID of hardware. Unique to each CPE
reads a utf-8 bytearray is actually utf-16
"""
ID = microcontroller.cpu.uid
"""
INTERVAL_*value* is the sample rate at which the value 
    is read and therefore sent to the serial port
"""
"""
SOUND constants

"""
NUM_SAMPLES = 50
INTERVAL_SOUND = 0.1
"""
TEMPERATURE constants
NOMINALRESISTOR the nominal resistance of the 
                standard NTC thermistor at the 
                nominal temperature in Ohms
                RT = R0

NOMINALTEMPERATURE the nominal temperature
                    T = T0

RMEASURED the resistance of the voltage divider R1
              RT      R1
    Vcc |---/\/\/---/\/\/----|< GND
                  |
                  ADC_in

BETACOEF    is the Beta coefficient of the simplified 
            Steinhart-Hart equation or Beta parameter
            equation:
            T = B/ln(R/r)
                r = R0*exp(-B/T0)

"""
NOMINALRESISTOR = 10000  # 10kOhm standard NTC thermistor
NOMINALTEMPERATURE = 25  # Room temperature standard NTC value in degrees Celcius
RMEASURED = 11371.93
BETACOEF = 3950

INTERVAL_TEMPERATURE = 1
"""
NEOPIXEL constants
NUM_PIXELS is the number of neopixels on board

"""
NUM_PIXELS = 10
INTERVAL_PIXEL = 0.1
"""
TEMPERATURE constants

"""
INTERVAL_LIGHT = 0.2
"""
FILE values

BUFFERNAME is the 
"""
BUFFERNAME = 'buffer.txt'
