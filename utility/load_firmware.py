import win32api
from shutil import copy
import time
bootloader = "../bootloader/adafruit-circuitpython-circuitplayground_express-3.0.0-rc.0.uf2"

# load bootloaders asssuming all start in bootloader mode
drive_letters = win32api.GetLogicalDriveStrings()
drive_letters = drive_letters.split('\000')[:-1]
for drive_letter in drive_letters:
    print(drive_letter)
    drive_name = win32api.GetVolumeInformation(drive_letter)[0]
    if drive_name == "CPLAYBOOT":
        copy(bootloader, drive_letter[:2])
        print(drive_name)

time.sleep(10)
# load CircuitPython firmware
firmware = "../firmware/"
constants = firmware + "constants.py"
code_dev = firmware + "code.py"
boot = firmware + "boot.py"
buffer = firmware + "buffer.txt"

drive_letters = win32api.GetLogicalDriveStrings()
drive_letters = drive_letters.split('\000')[:-1]
for drive_letter in drive_letters:
    drive_name = win32api.GetVolumeInformation(drive_letter)[0]
    if drive_name == "CIRCUITPY":
        copy(code_dev, drive_letter[:2]+'\\code.py')
        copy(constants, drive_letter[:2]+'\\constants.py')
        copy(boot, drive_letter[:2]+'\\boot.py')
        copy(buffer, drive_letter[:2]+'\\buffer.txt')
        print(drive_name)