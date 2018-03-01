#define PIN_ANALOG_TEMP 9
#define PIN_ANALOG_LIGHT 8


void setup() {
  Serial.begin(115200);
  pinMode(PIN_ANALOG_TEMP, INPUT);
  pinMode(PIN_ANALOG_LIGHT, INPUT);
}

//initialise variables
int temperatureADC = 0;
int light = 0;

void loop() {
  // put your main code here, to run repeatedly:
  temperatureADC = analogRead(PIN_ANALOG_TEMP);
  light = analogRead(PIN_ANALOG_LIGHT);
  Serial.print(temperatureADC);
  Serial.println(light);
  delay(100);

}
