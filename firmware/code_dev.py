import array
import math
import os
import sys
import time

import config as c

""" Check Python implementation for testing purposes. """
if sys.implementation.name == 'circuitpython':
    import audiobusio
    import board
    import neopixel
    from analogio import AnalogIn
    import adafruit_thermistor
    import supervisor

    supervisor.disable_autoreload()
    """ Initialise RGB colour list. """
    colour = [0, 0, 0]
    """ Initialise scheduling variables. """

    """ Initialise neopixels
        brightness is a value from 0-1
        auto_write = True means the pixels
        value change without show,
        but is extremely slow
    """
    pixels = neopixel.NeoPixel(board.NEOPIXEL,
                               c.NUM_PIXELS,
                               brightness=1,
                               auto_write=False)
    """ Initialise thermistor. """
    thermistor = adafruit_thermistor.Thermistor(board.TEMPERATURE,
                                                c.RMEASURED,
                                                c.NOMINALRESISTOR,
                                                c.NOMINALTEMPERATURE,
                                                c.BETACOEF)
    """ Initialise light ADC. """
    light = AnalogIn(board.LIGHT)
    """ Initialise sound measurements. """
    mic = audiobusio.PDMIn(
        board.MICROPHONE_CLOCK,
        board.MICROPHONE_DATA,
        sample_rate=c.SAMPLE_RATE,
        bit_depth=c.BIT_DEPTH)
    # Record an initial sample to calibrate. Assume it's quiet when we start.
    # TODO: this is dangerous, get rid of it
    # an array of unsigned shorts ('H')
    samples = array.array('H', [0] * c.NUM_SAMPLES)
    mic.record(samples, len(samples))

# Set lowest level to expect, plus a little.
# input_floor = normalised_rms(samples) + 10


# TODO: does this line need to be here?
light_last = temp_last = sound_last = neopixel_last = time.monotonic()


def mean(values):
    """Calculate the geometric mean of two numbers."""
    return sum(values) / len(values)


def normalised_rms(values):
    """
    calculate normalised rms value of sound recording
    of NUM_SAMPLES

    TODO: check whether len(values) includes zeroes
    i.e. empty buffer (samples) values are zero?
    """
    # Remove DC bias before computing RMS.
    dc_bias = int(mean(values))
    sum_squares = sum(float((sample - dc_bias)**2) for sample in values)
    return math.sqrt(sum_squares / len(values))


def serial(text):
    """Print serial value to serial port.

    e.g. COM3
    Serial port must be configured at other end
    with baudrate = 115200
    This is just a wrapper for print at the moment, but it makes the code less
    confusing as print is overloaded to write to serial.
    """
    print(text)


def basic_serial(value, sample_rate, now, last, sensor):
    """
    check basic scheduler for timing of sensor
    if scheduled, print to serial port
    """
    if now - last > sample_rate:
        serial(sensor + ": " + str(value))
        last = now

    return last


def sound_serial(mic, samples, sample_rate, now, last):
    """
    check basic scheduler for timing of sensor
    if scheduled:
        1. record sound data
            (blocking for NUM_SAMPLES*SAMPLE_RATE seconds)
        2. calculate magintude
        3. print to serial port
    """
    if now - last > sample_rate:
        mic.record(samples, len(samples))
        magnitude = normalised_rms(samples)
        serial("sound: {}".format(magnitude))
        last = now
    return last


def neopixel_control(fsize, buffer_name, sample_rate, now, last):
    """
    check basic scheduler for timing of sensor
    if scheduled:
        1. poll file size, if non-zero do nothing
            otherwise read file assuming first line
            is an RGB hex colour value
        2. change neopixels to colour
        3. send colour of neopixels to host until file emptied
    """
    if now - last > sample_rate:
        last = now
        if fsize > 0:
            with open(buffer_name, 'r') as fr:
                lines = fr.readlines()
                if len(lines) > 0:
                    # READ FIRST LINE FOR NOW
                    colour[0] = int(lines[0][:2], 16)
                    colour[1] = int(lines[0][2:4], 16)
                    colour[2] = int(lines[0][4:], 16)
                    serial("received")
            for i in range(c.NUM_PIXELS):
                pixels[i] = colour
                pixels.show()

            # send current pixel colour until windows destructive reads
            # N = pixels.__getitem__(0)
            # serial("N{}{}{}".format(N[0], N[1], N[2]))
    return last


def main():
    light_last = temp_last = sound_last = neopixel_last = time.monotonic()
    while True:
        # get the current time
        now = time.monotonic()

        # Serial print the value of the sensor value
        # and update last time if scheduled
        # last value is passed through if not scheduled
        light_last = basic_serial(light.value,
                                  c.INTERVAL_LIGHT,
                                  now,
                                  light_last,
                                  "light")
        temp_last = basic_serial(thermistor.temperature,
                                 c.INTERVAL_TEMPERATURE,
                                 now,
                                 temp_last,
                                 "temperature")
        sound_last = sound_serial(mic,
                                  samples,
                                  c.INTERVAL_SOUND,
                                  now,
                                  sound_last)

        # read the byte size of the file from the stat tuple
        fsize = os.stat(c.BUFFERNAME)[c.FILE_BYTE_SIZE]

        # update neopixel colour value if BUFFERNAME is not empty
        # serial prints new value until value is deleted
        neopixel_last = neopixel_control(fsize,
                                         c.BUFFERNAME,
                                         c.INTERVAL_PIXEL,
                                         now,
                                         neopixel_last)


if sys.implementation.name == 'circuitpython':
    main()
