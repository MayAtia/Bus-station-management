#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

//יש לעדכן את הנתונים הרלוונטים
const char* ssid = "SSID";
const char* password = "password";
const char* serverName = "http://IP:4000/saveUserEvent";

const int buttonPin = 5; 

int lineNumber = 123; 
int stationNumber = 1; 

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

    
    String url = String(serverName) + "?userId=Station&lineNumber=" + String(lineNumber) + "&station=" + String(stationNumber);
    sendUserEvent(url);

    delay(500); 
  }
}

void sendUserEvent(String url) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    Serial.println("Starting connection to server...");
    Serial.println(url);

    http.begin(client, url); 

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String response = http.getString(); 
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending GET: ");
      Serial.println(httpResponseCode);
      Serial.println(WiFi.localIP());

      Serial.println("WiFi status: " + String(WiFi.status()));
      Serial.println("Client connected: " + String(client.connected()));
    }

    http.end(); 
  } else {
    Serial.println("WiFi Disconnected");
  }
}
