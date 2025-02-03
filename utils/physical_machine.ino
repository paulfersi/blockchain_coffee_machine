const int relayPin = 2; 

void setup() {
  pinMode(relayPin, OUTPUT); 
  digitalWrite(relayPin, LOW); 
  Serial.begin(9600); 
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n'); 
    command.trim();

    if (command == "TRIGGER_RELAY") {
      digitalWrite(relayPin, HIGH); 
      delay(500);
      digitalWrite(relayPin, LOW);
      Serial.println("Relay triggered!");
    }
  }
}