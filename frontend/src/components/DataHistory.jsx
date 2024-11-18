import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../config/const";
const columns = [
  { field: "device", headerName: "Device", width: 130 },
  { field: "action", headerName: "Action", width: 130 },
  { field: "user", headerName: "User", width: 130 },
  {
    field: "createdAt",
    headerName: "Time",
    width: 230,
  },
];

const paginationModel = { page: 0, pageSize: 5 };
const DataHistory = () => {
  const [rows, setRows] = useState([]);
  const [chart, setChart] = useState();
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${BASE_URL}/history`, {
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
            device: curr?.device?.name || "null",
            action: curr.action,
            user: curr.user.email,
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
      <Typography fontSize={"35px"}>Lịch sử bật tắt thiết bị</Typography>
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

export default DataHistory;
