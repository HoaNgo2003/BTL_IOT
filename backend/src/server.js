const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sensor = require("./models/sensor.model");
const { connectDb } = require("./config/db");
const checkToken = require("./middleware/auth");
const userRouter = require("./router/user.route");
const sensorRouter = require("./router/sensor.route");
const roomRouter = require("./router/room.route");
const historyRouter = require("./router/history.route");
const espRoutes = require("./router/esp.route");
const Device = require("./models/device.model");
const WebSocket = require("ws");
const app = express();
connectDb();

app.use(bodyParser.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/sensors", sensorRouter);
app.use("/api/history", checkToken, historyRouter);
app.use("/api/room", checkToken, roomRouter);
app.use("/api/esps", espRoutes);

// MQTT Configuration
const MQTT_SERVER = "64ca3a96ec76450c8cb527a5dcaccd7f.s1.eu.hivemq.cloud";
const MQTT_PORT = "8883";
const MQTT_USER = "hoango";
const MQTT_PASSWORD = "HoaNgo1610";
const MQTT_SENSOR_TOPIC = "ESP32/Sensors";
const MQTT_LED_TOPIC = "ESP32/Led";
const MQTT_FAN_TOPIC = "ESP32/Fan";
const MQTT_MODE_TOPIC = "ESP32/Mode";

// Store sensor data
let sensorData = {
  temperature: null,
  humidity: null,
  lightLevel: null,
};
let autoMode = true;

// Connect to MQTT
const client = mqtt.connect("mqtts://" + MQTT_SERVER, {
  port: MQTT_PORT,
  username: MQTT_USER,
  password: MQTT_PASSWORD,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(
    [MQTT_SENSOR_TOPIC, MQTT_LED_TOPIC, MQTT_FAN_TOPIC, MQTT_MODE_TOPIC],
    (err) => {
      if (!err) {
        console.log(
          `Subscribed to topics: ${MQTT_SENSOR_TOPIC}, ${MQTT_LED_TOPIC}, ${MQTT_FAN_TOPIC}, ${MQTT_MODE_TOPIC}`
        );
      }
    }
  );
});

client.on("message", (topic, message) => {
  const payload = message.toString();
  console.log(payload);
  if (topic === MQTT_SENSOR_TOPIC) {
    // Update sensor data
    try {
      const data = JSON.parse(payload);
      sensorData.temperature = data.temperature;
      sensorData.humidity = data.humidity;
      sensorData.lightLevel = data.light;
      const sensorDataNew = new Sensor(sensorData);
      sensorDataNew.save();
      console.log("Updated sensor data:", sensorData);
    } catch (error) {
      console.error("Failed to parse sensor data:", error);
    }
  } else if (topic === MQTT_MODE_TOPIC) {
    // Update mode (auto/manual)
    autoMode = payload === "1";
    console.log(`Auto mode set to: ${autoMode}`);
  }

  // Forward MQTT data to WebSocket clients
  if (wsClients.length > 0) {
    wsClients.forEach((client) => {
      client.send(JSON.stringify({ topic, message: payload }));
    });
  }
});

// API Endpoint to change LED state
app.post("/api/light", checkToken, async (req, res) => {
  const { state, deviceId } = req.body;
  client.publish(`${MQTT_LED_TOPIC}/${deviceId}`, state ? "1" : "0");
  res.json({ success: true, ledState: state });
  const updatedDevice = await Device.findOneAndUpdate(
    { _id: deviceId },
    { $set: { status: state ? "ON" : "OFF" } },
    { new: true }
  );
  console.log(updatedDevice);
});

// API Endpoint to change fan state
app.post("/api/fan", checkToken, async (req, res) => {
  const { state, deviceId } = req.body;

  client.publish(MQTT_FAN_TOPIC, state ? "1" : "0");
  res.json({ success: true, fanState: state });
  const updatedDevice = await Device.findOneAndUpdate(
    { _id: deviceId },
    { $set: { status: state ? "ON" : "OFF" } },
    { new: true }
  );
});

// API Endpoint to change mode (auto/manual)
app.post("/api/mode", checkToken, (req, res) => {
  const { auto } = req.body;
  autoMode = auto;
  client.publish(MQTT_MODE_TOPIC, auto ? "1" : "0");
  res.json({ success: true, mode: auto ? "AUTO" : "MANUAL" });
});

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
const wsClients = [];

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");
  wsClients.push(ws);

  // Send initial sensor data to new WebSocket client
  ws.send(
    JSON.stringify({
      topic: "ESP32/Sensors",
      message: JSON.stringify(sensorData),
    })
  );

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);

    if (message.topic && message.message) {
      client.publish(message.topic, message.message);
    }
  });

  ws.on("close", () => {
    const index = wsClients.indexOf(ws);
    if (index !== -1) {
      wsClients.splice(index, 1);
    }
    console.log("WebSocket client disconnected");
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
