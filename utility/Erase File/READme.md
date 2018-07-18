1.  Double-click the reset button on the board to bring up the `CPLAYBOOT drive`. The CPE should light up green or red
2.  Drag the erase `.uf2` file to the `CPLAYBOOT` drive. `flash_erase_express.ino.circuitplay`
3.  A single onboard NeoPixel will turn blue, indicating the erase has started.
4.  After approximately 15 seconds, the same NeoPixel will start flashing green.
5.  Double-click the reset button on the board to bring up the `CPLAYBOOT` drive.
6.  [Drag the appropriate latest release of CircuitPython](https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython) `.uf2` file to the `CPLAYBOOT` drive.

It should reboot automatically and you should see `CIRCUITPY` in your file explorer again.

If the LED flashes red during step 5, it means the erase has failed. Repeat the steps starting with 2.

[If you haven't already downloaded the latest release of CircuitPython for your board, check out the installation page](https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython).   
You'll also need to install your libraries and code!