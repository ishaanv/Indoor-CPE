#define PIN_ANALOG_TEMP 9
#define PIN_ANALOG_LIGHT 8

long previousMillis = 0;
long interval = 1000; 

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

  unsigned long currentMillis = millis();
  Serial.println(currentMillis - previousMillis);
  previousMillis = currentMillis;
  delay(100);

}
