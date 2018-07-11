#include <Scheduler.h>
#include <Adafruit_NeoPixel.h>

#define NEOPIN         8
#define NUMPIXELS      10
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, NEOPIN, NEO_RGB + NEO_KHZ800);

#define PIN_ANALOG_TEMP 9
#define PIN_ANALOG_LIGHT 8
#define LED_BOARD 13

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return pixels.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return pixels.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

void setup() {
  Serial.begin(115200);
  pixels.begin();
  int16_t i;
  //clear pixels
  for(i=0; i<pixels.numPixels(); i++) {
      pixels.setPixelColor(i, 0x000000);
      pixels.show();      
  }
  
  pinMode(LED_BOARD, OUTPUT);
  pinMode(PIN_ANALOG_TEMP, INPUT);
  pinMode(PIN_ANALOG_LIGHT, INPUT);
  
  // Add "loop2" and "loop3" to scheduling.
  // "loop" is always started by default.
  Scheduler.startLoop(loop2);
  Scheduler.startLoop(loop3);
}

//initialise variables
int temperatureADC = 0;
int light = 0;

// LED loop
void loop() {
  
  int16_t i;
  // 'Color wipe' across all pixels
  for(uint32_t c = 0xFF0000; c; c >>= 8) { // Red, green, blue
    for(i=0; i<pixels.numPixels(); i++) {
      pixels.setPixelColor(i, c);
      pixels.show();
      delay(500);      
    }
  }
}

// anaolog loop
void loop2() {
  // put your main code here, to run repeatedly:
  temperatureADC = analogRead(PIN_ANALOG_TEMP);
  light = analogRead(PIN_ANALOG_LIGHT);
  Serial.print(temperatureADC);
  Serial.println(light);
  delay(100);
}

void loop3() {
  Serial.print("loop3");

}

