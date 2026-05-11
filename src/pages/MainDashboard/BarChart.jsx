import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({ height }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
  const data2024 = [71.13, 81.83, 83, 70.13, 86.91, 90.13, 93.24];
  const data2025 = [75.13, 83, 88.83, 87.13, 88.1, 93.24, 94.91];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", 
      },
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
      borderColor: "#ccc",
      textStyle: {
        color: "#333",
      },
      
      formatter: function (params) {
        let res = `<div style="font-weight:bold; margin-bottom:4px;">${params[0].name}</div>`;
        params.forEach((item) => {
          res += `<div style="display:flex; justify-content:space-between; gap:15px;">
            <span>${item.marker} ${item.seriesName}</span>
            <span style="font-weight:bold;">${item.value.toFixed(2)}</span>
          </div>`;
        });
        return res;
      },
    },
    grid: {
      left: "0",
      right: "0",
      bottom: "10%",
      top: "15%",
      containLabel: true,
    },
    legend: {
      data: ["Tahun 2024", "Tahun 2025"],
      top: 0,
      right: 10,
      icon: "circle",
      textStyle: {
        color: "#555",
        fontSize: 12,
      },
    },
    xAxis: {
      type: "category",
      data: months,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12, color: "#666", fontWeight: 500 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: "#999" },
    },
    series: [
      {
        name: "Tahun 2024",
        type: "bar",
        data: data2024,
        itemStyle: {
          color: "#D1D5DB",
        },
        barWidth: "25%",
        barGap: "30%", 
      },
      {
        name: "Tahun 2025",
        type: "bar",
        data: data2025.map((val, idx) => ({
          value: val,
        })),
        itemStyle: {
          color: "#59C7FF",
        },
        barWidth: "25%",
        barGap: "30%",
      },
    ],
    animationDuration: 800,
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "200px" }}
      />
    </div>
  );
}