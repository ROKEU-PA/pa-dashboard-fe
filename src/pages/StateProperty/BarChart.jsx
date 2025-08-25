import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({
  height = "h-72", // Tailwind height: h-64 / h-72 / h-80
}) {
  const years = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const values = [888.3, 686.91, 288.1, 1893, 482.44, 394.91, 122, 998];

  const option = {
    grid: {
      top: 30, // distance from top
      right: 0, // distance from right
      bottom: 30, // distance from bottom
      left: 35, // distance from left
      containLabel: true, // make sure labels are inside the chart
    },
    xAxis: {
      type: "category",
      gridIndex: 0,
      data: years,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      name: "Juta",
      nameLocation: "middle",
      nameGap: 45, // increase spacing between axis name and labels
      nameTextStyle: {
        fontSize: 14,
        fontFamily: "Funnel Display",
      },
      axisLabel: {
        fontSize: 12,
        margin: 10, // spacing between labels and axis line
      },
      // min: 0,
      // max: 100,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: "bar",
        data:
          values.length > 0 &&
          values?.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: "#2979FF", // biru utk terakhir
              borderRadius: [10, 10, 0, 0],
            },
            label: {
              show: true,
              position: "top",
              formatter: val.toFixed(2),
              backgroundColor: "#fff",
              padding: [4, 8],
              borderRadius: 6,
              color: "#333",
              fontWeight: "normal",
              shadowColor: "rgba(0,0,0,0.1)",
              shadowBlur: 4,
            },
          })),
        barWidth: "40%",
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
