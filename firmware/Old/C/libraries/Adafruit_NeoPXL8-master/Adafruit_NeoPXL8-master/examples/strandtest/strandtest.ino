// Example/diagnostic for the Adafruit_NeoPXL8 library.  Each of 8 strands
// is a distinct color, helps identify which pin goes to which strand.
// For more complete usage of NeoPixel operations, see the examples
// included with the 'regular' Adafruit_NeoPixel library.

// Also requires LATEST Adafruit_NeoPixel, Adafruit_ZeroDMA and
// Adafruit_ASFcore libraries.

// May require a logic level shifter (e.g. 75HCT245) for 5V pixels,
// or use NeoPXL8 Featherwing for Adafruit Feather M0 boards.

#include <Adafruit_NeoPXL8.h>

#define NUM_LED 10  // Per strand. Total number of pixels is 8X this!

// Second argument to constructor is an optional 8-byte pin list,
// or pass NULL to use pins 0-7 on Metro Express, Arduino Zero, etc.
Adafruit_NeoPXL8 leds(NUM_LED, NULL, NEO_GRB);

// Here's a pinout that works with the Feather M0.  These are the
// default connections for the 2x8 header on the NeoPXL8 Featherwing,
// which is 1:1 compatible with Fadecandy cabling:
//int8_t pins[8] = { PIN_SERIAL1_RX, PIN_SERIAL1_TX, MISO, 13, 5, SDA, A4, A3 };
//Adafruit_NeoPXL8 leds(NUM_LED, pins, NEO_GRB);

// If using the Featherwing RJ45 connections, the pin order can be
// reversed if 1:1 compatibility with OctoWS2811 cabling is desired:
// int8_t pins[8] = { A3, A4, SDA, 5, 13, MISO, PIN_SERIAL1_TX, PIN_SERIAL1_RX };

// 5 pins on the Featherwing have reconfigurable jumpers, in case the
// default pin connections interfere with a needed peripheral (Serial1,
// I2C or SPI).  You do NOT need to use all 5 alternates; you can pick
// and choose as needed!  But if changing all 5, they would be:
//int8_t pins[8] = { 12, 10, 11, 13, SCK, MOSI, A4, A3 };

// And again, reverse the order for OctoWS2811-compatible cabling:
// int8_t pins[8] = { A3, A4, MOSI, SCK, 13, 11, 10, 12 };

void setup() {
  leds.begin();
  leds.setBrightness(32);
}

uint8_t frame = 0;

void loop() {
  for(uint8_t r=0; r<8; r++) { // For each row...
    for(int p=0; p<NUM_LED; p++) { // For each pixel of row...
      leds.setPixelColor(r * NUM_LED + p, rain(r, p));
    }
  }
  leds.show();
  frame++;
}

uint8_t colors[8][3] = { // RGB colors for the 8 rows...
  255,   0,   0, // Row 0: Red
  255, 160,   0, // Row 1: Orange
  255, 255,   0, // Row 2: Yellow
    0, 255,   0, // Row 3: Green
    0, 255, 255, // Row 4: Cyan
    0,   0, 255, // Row 5: Blue
  192,   0, 255, // Row 6: Purple
  255,   0, 255  // Row 7: Magenta
};

// Gamma-correction table improves the appearance of midrange colors
#define _GAMMA_ 2.6
const int _GBASE_ = __COUNTER__ + 1; // Index of 1st __COUNTER__ ref below
#define _G1_ (uint8_t)(pow((__COUNTER__ - _GBASE_) / 255.0, _GAMMA_) * 255.0 + 0.5),
#define _G2_ _G1_ _G1_ _G1_ _G1_ _G1_ _G1_ _G1_ _G1_ // Expands to 8 lines
#define _G3_ _G2_ _G2_ _G2_ _G2_ _G2_ _G2_ _G2_ _G2_ // Expands to 64 lines
const uint8_t gamma8[] = { _G3_ _G3_ _G3_ _G3_ };    // 256 lines

// Given row number (0-7) and pixel number along row (0 - (NUM_LED-1)),
// first calculate brightness (b) of pixel, then multiply row color by
// this and run it through gamma-correction table.
uint32_t rain(uint8_t row, int pixelNum) {
  uint16_t b = 256 - ((frame - row * 32 + pixelNum * 256 / NUM_LED) & 0xFF);
  return ((uint32_t)gamma8[(colors[row][0] * b) >> 8] << 16) |
         ((uint32_t)gamma8[(colors[row][1] * b) >> 8] <<  8) |
                    gamma8[(colors[row][2] * b) >> 8];
}
