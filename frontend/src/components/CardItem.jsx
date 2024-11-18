import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CardItemData = ({ percentage, name, color, dvi }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "15px",
        }}
      >
        <CircularProgressbar
          value={percentage}
          maxValue={100}
          styles={buildStyles({
            rotation: 0.75, // Quay vòng cung 270 độ để chỉ hiển thị nửa trên
            strokeLinecap: "round", // Đầu vạch tròn
            pathColor: `${color}`, // Màu của đường chính
            trailColor: "#f0e1d0", // Màu nền
          })}
          strokeWidth={10} // Độ dày của vòng cung
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "2rem" }}>{name}</span>
          <div style={{ fontSize: "30px", fontWeight: "500" }}>
            {percentage}
            {dvi}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItemData;
