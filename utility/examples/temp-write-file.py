# from analogio import AnalogIn
# import adafruit_thermistor
# import array
# import audiobusio
import board
import digitalio
# import math
import microcontroller
# import neopixel
# import storage
# import sys
import time

led = digitalio.DigitalInOut(board.D13)
led.switch_to_output()

try:
    with open("/temperature.txt", "a") as fp:
        while True:
            temp = microcontroller.cpu.temperature
            # do the C-to-F conversion here if you would like
            print(temp)
            fp.write('{0:f}\n'.format(temp))
            fp.flush()
            led.value = not led.value
            time.sleep(1)
except OSError as e:
    print(e)
    delay = 0.5
    if e.args[0] == 28:
        delay = 0.25
    while True:
        led.value = not led.value
        time.sleep(delay)
# while True:
#     x = sys.stdin.read(1)
#     print(x)
