import array
import audiobusio
import board
import math
import neopixel
import time
import sys

import adafruit_thermistor
import board
import time
from analogio import AnalogIn

thermistor = adafruit_thermistor.Thermistor(board.TEMPERATURE, 11371.93, 10000, 25, 3950)
analogin = AnalogIn(board.LIGHT)

# Exponential scaling factor.
# Should probably be in range -10 .. 10 to be reasonable.
CURVE = 2
SCALE_EXPONENT = math.pow(10, CURVE*-0.1)

PEAK_COLOR = (100, 0, 255)
NUM_PIXELS = 10

# Number of samples to read at once.
NUM_SAMPLES = 200

# Restrict value to be between floor and ceiling.
def constrain(value, floor, ceiling):
    return max(floor, min(value, ceiling))

# Scale input_value to be between output_min and output_max, in an exponential way.
def log_scale(input_value, input_min, input_max, output_min, output_max):
    normalized_input_value = (input_value - input_min) / (input_max - input_min)
    return output_min + math.pow(normalized_input_value, SCALE_EXPONENT) * (output_max - output_min)

# Remove DC bias before computing RMS.
def normalized_rms(values):
    minbuf = int(mean(values))
    return math.sqrt(sum(float((sample-minbuf)*(sample-minbuf)) for sample in values)/len(values))

def mean(values):
    return (sum(values) / len(values))

def volume_color(i):
    return (200, i*(255//NUM_PIXELS), 0)

# Main program

# Set up NeoPixels and turn them all off.
pixels = neopixel.NeoPixel(board.NEOPIXEL, NUM_PIXELS, brightness=0.1, auto_write=False)
pixels.fill(0)
pixels.show()

mic = audiobusio.PDMIn(board.MICROPHONE_CLOCK, board.MICROPHONE_DATA, frequency=16000, bit_depth=16)
# Record an initial sample to calibrate. Assume it's quiet when we start.
samples = array.array('H', [0] * NUM_SAMPLES)
mic.record(samples, len(samples))
# Set lowest level to expect, plus a little.
input_floor = normalized_rms(samples) + 10
# OR: used a fixed floor
# input_floor = 50

# You might want to print the input_floor to help adjust other values.
# print(input_floor)

# Corresponds to sensitivity: lower means more pixels light up with lower sound
# Adjust this as you see fit.
input_ceiling = input_floor + 500


j = 0
peak = 0
interval_sound = 0.1
interval_analog = 1
interval_pixel = 0.1
last = time.monotonic()
last1 = last
last2 = last
last3 = last
magnitude = input_floor
while True:
    # last = sys.stdin.readline()
    # print(last)
    # print("last:{}".foramt(last))
    if last == 'd':
        print("HELLO")
    now = time.monotonic()
    if abs(last3 - now) > interval_pixel:
        c = log_scale(
            constrain(magnitude, input_floor, input_ceiling), input_floor,
            input_ceiling, 0, NUM_PIXELS)
        pixels.fill(0)
        for i in range(NUM_PIXELS):
            # pixels[i] = ((100 + j) % 255, int(j/5) % 255, (100 + j*2) % 255)
            if i < c:
                pixels[i] = volume_color(i)
            # Light up the peak pixel and animate it slowly dropping.
            if c >= peak:
                peak = min(c, NUM_PIXELS - 1)
            elif peak > 0:
                peak = peak - 1
            if peak > 0:
                pixels[int(peak)] = PEAK_COLOR
        pixels.show()
        j += 10
        last3 = now
    # print(now)
    if abs(last1 - now) > interval_analog:
        # print("Temperature is: {} C Lux is: {}".format(thermistor.temperature,
        #                                                analogin.value))
        print("temp: {}\nlight: {}".format(thermistor.temperature,
                                           analogin.value))
        last1 = now
    if abs(last2 - now) > interval_sound:
        mic.record(samples, len(samples))
        magnitude = normalized_rms(samples)
        print("sound: {}".format(magnitude))
        last2 = now


    # magnitude = normalized_rms(samples)
    # # You might want to print this to see the values.
    # print(magnitude)

    # Compute scaled logarithmic reading in the range 0 to NUM_PIXELS


    # Light up pixels that are below the scaled and interpolated magnitude.
