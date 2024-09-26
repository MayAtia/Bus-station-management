#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

//יש לעדכן את הנתונים הרלוונטים
const char* ssid = "SSID";
const char* password = "password";
const char* serverName = "http://IP:4000/saveUserEvent";

const int buttonPin = 3; 

WiFiClient client;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP); 
  delay(10);


  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  int buttonState = digitalRead(buttonPin);


  if (buttonState == LOW) {
    Serial.println("Button pressed!");
    sendConfirmRequest();
    delay(500); 
  }
}

void sendConfirmRequest() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = String(serverName) + "?&station=" + getNextStationToConfirm();
    Serial.println("Sending confirmation to: " + url);

    http.begin(client, url); 

    int httpResponseCode = http.GET(); 

    if (httpResponseCode > 0) {
      String response = http.getString(); 
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending GET: ");
      Serial.println(httpResponseCode);
    }

    http.end(); 
  } else {
    Serial.println("WiFi Disconnected");
  }
}

int getNextStationToConfirm() {

  static int currentStation = 0;
  currentStation++;
  if (currentStation > 4) {
    currentStation = 1; 
  }

  return currentStation;
}
