#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Wi-Fi credentials
const char* ssid = "NK";
const char* password = "9345611558";

// Server URL
const char* serverUrl = "http://192.168.227.137:3000/upload";

// Sensor Pins
const int voltageSensorPin = D0; // Analog pin for voltage sensor (Adjust if needed)
const int currentSensorPin = D1; // Analog pin for current sensor (Adjust if needed)

// Calibration factors
const float voltageCalibration = 5.0;  // Adjust based on your ZMPT101B
const float currentCalibration = 30.0; // Adjust for your ACS712 model
const int adcResolution = 1024;        // ADC resolution for ESP8266

// Sampling settings
const int samples = 500; // Reduce samples for faster readings

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.println("Connecting to Wi-Fi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loop() {
  float voltage = readVoltage();
  float current = readCurrent();
  float power = voltage * current;

  // Debugging output
  Serial.println("===== Sensor Readings =====");
  Serial.printf("Voltage: %.2f V\n", voltage);
  Serial.printf("Current: %.2f A\n", current);
  Serial.printf("Power: %.2f W\n", power);

  // Send data to the server
  if (WiFi.status() == WL_CONNECTED) {
    sendToServer(voltage, current, power);
  } else {
    reconnectWiFi();
  }

  delay(5000); // Wait 5 seconds before next reading
}

// Function to read voltage
float readVoltage() {
  float sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(voltageSensorPin);
  }
  float average = sum / samples;
  float voltage = (average * voltageCalibration) / adcResolution; // Convert ADC to voltage
  return voltage;
}

// Function to read current
float readCurrent() {
  float sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(currentSensorPin);
  }
  float average = sum / samples;
  float current = ((average - (adcResolution / 2)) * currentCalibration) / adcResolution; // Convert ADC to current
  return current;
}

// Function to send data to the server
void sendToServer(float voltage, float current, float power) {
  WiFiClient client;  // Create a WiFiClient object
  HTTPClient http;    // Create an HTTPClient object
  
  http.begin(client, serverUrl);  // Use client and URL to begin the connection
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{\"voltage\":" + String(voltage) + 
                       ",\"current\":" + String(current) + 
                       ",\"power\":" + String(power) + "}";

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("Server Response (%d): %s\n", httpResponseCode, response.c_str());
  } else {
    Serial.printf("Error sending data: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();  // End the HTTP request
}

// Function to reconnect Wi-Fi
void reconnectWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi disconnected. Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }
    Serial.println("\nReconnected to Wi-Fi");
  }
}
