#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include "DHTesp.h"
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "mật khẩu là 16102003";      // Your WiFi SSID
const char* password = "HoaNgo2003";           // Your WiFi Password

// HiveMQ Cloud credentials
const char* mqtt_server = "64ca3a96ec76450c8cb527a5dcaccd7f.s1.eu.hivemq.cloud";
const int mqtt_port = 8883; // Secure MQTT port
const char* mqtt_username = "hoango";         // MQTT Username
const char* mqtt_password = "HoaNgo1610";     // MQTT Password

// MQTT topics
#define MQTT_SENSOR_TOPIC "ESP32/Sensors"
#define MQTT_LED_TOPIC "ESP32/Led/"
#define MQTT_FAN_TOPIC "ESP32/Fan"
#define MQTT_MODE_TOPIC "ESP32/Mode"
#define MQTT_STATUS_TOPIC "ESP32/Status"

// GPIO Pins
#define LEDPIN1 17  // LED 1
#define LEDPIN2 32  // LED 2
#define FANPIN 18
#define DHTPIN 19
#define DHTTYPE DHT11
#define LDRPIN 34

WiFiClientSecure espClient;        // Secure WiFi client
PubSubClient client(espClient);    // MQTT client
DHTesp dht;

// Global variables
bool autoMode = false; // Default mode: Manual
int current_led1State = LOW, last_led1State = LOW;
int current_led2State = LOW, last_led2State = LOW;
int current_fanState = HIGH, last_fanState = HIGH; // Fan off by default (HIGH)
unsigned long previousMillis = 0;
const long interval = 5000; // Sensor reading interval

// Function to connect to WiFi
void setup_wifi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
}

// Function to reconnect to MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32_" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe((String(MQTT_LED_TOPIC) + "673a9cbb9762b7310607c88a").c_str());
      client.subscribe((String(MQTT_LED_TOPIC) + "673a9cc79762b7310607c8b0").c_str());
      client.subscribe(MQTT_FAN_TOPIC);
      client.subscribe(MQTT_MODE_TOPIC);
      client.publish(MQTT_STATUS_TOPIC, "Connected");
    } else {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

// MQTT Callback function
void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0'; // Null-terminate payload
  String message = String((char*)payload);
  Serial.printf("Message received on topic %s: %s\n", topic, message.c_str());

  if (String(topic) == String(MQTT_LED_TOPIC) + "673a9cbb9762b7310607c88a" && !autoMode) {
    current_led1State = (message == "1") ? HIGH : LOW;
  } else if (String(topic) == String(MQTT_LED_TOPIC) + "673a9cc79762b7310607c8b0" && !autoMode) {
    current_led2State = (message == "1") ? HIGH : LOW;
  } else if (String(topic) == MQTT_FAN_TOPIC && !autoMode) {
    current_fanState = (message == "1") ? LOW : HIGH; // Reverse fan logic
  } else if (String(topic) == MQTT_MODE_TOPIC) {
    autoMode = (message == "1");
    String modeStatus = autoMode ? "AUTO" : "MANUAL";
    Serial.println("Mode set to: " + modeStatus);
    client.publish(MQTT_STATUS_TOPIC, modeStatus.c_str());
  }
}

// Function to publish status
void publishStatus(const char* device, const char* status) {
  DynamicJsonDocument statusDoc(256);
  statusDoc["mode"] = autoMode ? "AUTO" : "MANUAL";
  statusDoc["device"] = device;
  statusDoc["status"] = status;

  char statusMessage[128];
  serializeJson(statusDoc, statusMessage);
  client.publish(MQTT_STATUS_TOPIC, statusMessage);
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  espClient.setInsecure(); // Allow insecure connection for HiveMQ Cloud
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();
  dht.setup(DHTPIN, DHTesp::DHT11);

  pinMode(LEDPIN1, OUTPUT);
  pinMode(LEDPIN2, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  pinMode(LDRPIN, INPUT);

  // Initialize devices
  digitalWrite(LEDPIN1, LOW); // LED 1 off
  digitalWrite(LEDPIN2, LOW); // LED 2 off
  digitalWrite(FANPIN, HIGH); // Fan off (HIGH)
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Update LED 1 State
  if (last_led1State != current_led1State) {
    last_led1State = current_led1State;
    digitalWrite(LEDPIN1, current_led1State);
    publishStatus("LED1", current_led1State ? "ON" : "OFF");
  }

  // Update LED 2 State
  if (last_led2State != current_led2State) {
    last_led2State = current_led2State;
    digitalWrite(LEDPIN2, current_led2State);
    publishStatus("LED2", current_led2State ? "ON" : "OFF");
  }

  // Update Fan State
  if (last_fanState != current_fanState) {
    last_fanState = current_fanState;
    digitalWrite(FANPIN, current_fanState);
    publishStatus("Fan", current_fanState == LOW ? "ON" : "OFF");
  }

  // Sensor Data and Auto Mode
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Read sensor data
    float h = dht.getHumidity();
    float t = dht.getTemperature();
    int lightLevel = analogRead(LDRPIN);

    if (!isnan(h) && !isnan(t)) {
      // Publish sensor data
      DynamicJsonDocument doc(1024);
      doc["temperature"] = t;
      doc["humidity"] = h;
      doc["light"] = lightLevel;
      char mqtt_message[128];
      serializeJson(doc, mqtt_message);
      client.publish(MQTT_SENSOR_TOPIC, mqtt_message);

      // Auto Mode logic
      if (autoMode) {
        current_led1State = current_led2State = (lightLevel < 200) ? HIGH : LOW;
        current_fanState = (t > 25 && h > 60) ? LOW : HIGH; // Reverse fan logic
      }

      // Debug output
      Serial.printf("Temperature: %.2f°C, Humidity: %.2f%%, Light: %d\n", t, h, lightLevel);
    } else {
      Serial.println("Failed to read from sensors!");
    }
  }
}
