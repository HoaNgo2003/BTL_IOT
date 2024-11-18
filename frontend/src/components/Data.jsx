import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardItemData from "./CardItem";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading state

const TYPE = {
  light: "Light",
  fan: "Fan",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const Data = () => {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    lightLevel: null,
  });

  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting..."); // State to track WebSocket connection status

  useEffect(() => {
    // Mở kết nối WebSocket khi component được render
    const websocket = new WebSocket("ws://localhost:8080");

    // Khi kết nối thành công
    websocket.onopen = () => {
      console.log("WebSocket connection established.");
      setConnectionStatus("Connected"); // Update status to connected
    };

    // Khi gặp lỗi kết nối
    websocket.onerror = () => {
      console.error("WebSocket connection failed.");
      setConnectionStatus("Connection failed"); // Update status to connection failed
    };

    // Khi nhận được thông tin từ WebSocket
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.topic === "ESP32/Sensors") {
        // Cập nhật dữ liệu cảm biến khi nhận được thông tin
        console.log(data.message);
        const sensorData = JSON.parse(data.message);
        setSensorData({
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          lightLevel: sensorData.light || 0,
        });
      }
    };

    // Lưu WebSocket vào state để có thể đóng khi component bị hủy
    setWs(websocket);

    // Đóng WebSocket khi component bị hủy
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  return (
    <div>
      {/* Display connection status */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        {connectionStatus === "Connecting..." && <CircularProgress />}
        <span style={{ marginLeft: "10px" }}>{connectionStatus}</span>
      </Box>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 12 }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={3}>
          <Item>
            <Box display="flex" flexDirection="column">
              <CardItemData
                percentage={Number(sensorData.temperature)}
                name="Temperature"
                color="#82e0aa"
                dvi="&deg;C"
              />
            </Box>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <Box display="flex" flexDirection="column">
              <CardItemData
                percentage={Number(sensorData.humidity)}
                name="Humidity"
                color="#f5b041"
                dvi="%"
              />
            </Box>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <Box display="flex" flexDirection="column">
              <CardItemData
                percentage={Number(sensorData?.lightLevel)}
                name="Light level"
                color="#5dade2"
                dvi="lux"
              />
            </Box>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default Data;
