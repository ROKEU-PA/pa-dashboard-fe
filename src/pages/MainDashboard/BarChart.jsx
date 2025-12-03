import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({ height = "h-72" }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
  const data2024 = [71.13, 81.83, 83, 70.13, 86.91, 90.13, 93.24];
  const data2025 = [75.13, 83, 88.83, 87.13, 88.1, 93.24, 94.91];

  const option = {
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
    legend: {
      data: ["Tahun 2024", "Tahun 2025"],
      bottom: 0,
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
          borderRadius: [8, 8, 0, 0],
        },
        barWidth: "25%",
        barGap: "30%", // jarak antar seri
        label: {
          show: true,
          position: "mid",
          color: "#999",
          fontSize: 11,
          formatter: (p) => p.value.toFixed(2),
        },
      },
      {
        name: "Tahun 2025",
        type: "bar",
        data: data2025.map((val, idx) => ({
          value: val,
          label: {
            show: true,
            position: "top",
            formatter: (params) =>
              idx === data2025.length - 1
                ? `{bubble|${params.value.toFixed(2)}}`
                : params.value.toFixed(2),
            rich: {
              bubble: {
                backgroundColor: "#2979FF",
                color: "#fff",
                padding: [4, 8],
                borderRadius: 6,
                fontWeight: "bold",
                shadowColor: "rgba(0,0,0,0.15)",
                shadowBlur: 6,
              },
            },
            color: idx === data2025.length - 1 ? "#fff" : "#2979FF",
            fontWeight: idx === data2025.length - 1 ? "bold" : "normal",
          },
        })),
        itemStyle: {
          color: "#2979FF",
          borderRadius: [8, 8, 0, 0],
        },
        barWidth: "25%",
        barGap: "50%",
      },
    ],
    animationDuration: 800,
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
