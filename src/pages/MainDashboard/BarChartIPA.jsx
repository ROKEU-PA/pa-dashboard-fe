import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChartIPA({
  height = "h-72", // Tailwind height: h-64 / h-72 / h-80
}) {
  const years = ["2021", "2022", "2023", "2024"];
  const values = [2.91, 2.98, 3.24, 3.59];

  const option = {
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: years,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 4,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: "bar",
        data: values.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: idx === values.length - 1 ? "#2979FF" : "#ccc", // biru utk terakhir
            borderRadius: [10, 10, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            formatter: val.toFixed(2),
            backgroundColor: "#fff",
            padding: [4, 8],
            borderRadius: 6,
            color: idx === values.length - 1 ? "#2979FF" : "#333",
            fontWeight: idx === values.length - 1 ? "bold" : "normal",
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
