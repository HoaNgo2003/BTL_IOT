import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../config/const";
const columns = [
  { field: "temperature", headerName: "Temperature", width: 130 },
  { field: "humidity", headerName: "Humidity", width: 130 },
  { field: "lightLevel", headerName: "Light level", width: 130 },
  {
    field: "createdAt",
    headerName: "Time",
    width: 230,
  },
];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: 25 },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

const paginationModel = { page: 0, pageSize: 5 };
const DataSensor = () => {
  const [rows, setRows] = useState([]);
  const [chart, setChart] = useState();
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${BASE_URL}/sensors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      const arr = data.reduce((pre, curr, index) => {
        return [
          ...pre,
          {
            id: index + 1,
            temperature: curr.temperature,
            humidity: curr.humidity,
            lightLevel: curr.lightLevel,
            createdAt: moment(curr.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          },
        ];
      }, []);
      const weeklyData = data.slice(0, 8);
      console.log(weeklyData);
      console.log(chart);
      setRows(arr);
    };
    fetchData();
  }, []);
  return (
    <>
      <Typography fontSize={"35px"}>
        Dữ liệu đo nhiệt độ,độ ẩm, ánh sáng
      </Typography>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
};

export default DataSensor;
