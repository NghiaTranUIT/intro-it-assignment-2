int temp = A0;
int moist = A1;
int light = A2;

void setup(){
  pinMode(temp, INPUT);
  pinMode(moist, INPUT);
  pinMode(light, INPUT);
  Serial.begin(9600);
}

void loop(){
  float tout = analogRead(temp);
  tout = (tout*500)/1023;
  int mout = analogRead(moist);
  int lout = analogRead(light);
  Serial.print("{\"temperature\":");
  Serial.print(tout);
  Serial.print(",\"moisture\":");
  Serial.print(mout);
  Serial.print(",\"light\":");
  Serial.print(lout);
  Serial.println("}");
  delay(5000);
}