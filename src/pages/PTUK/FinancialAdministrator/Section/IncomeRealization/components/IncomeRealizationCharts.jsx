import React from "react";
import ReactECharts from "echarts-for-react";
import { legend } from "../constants";

export default function IncomeRealizationCharts({ height = "h-[30rem]" }) {
  const eselons = legend;
  const data2024 = [71.13, 81.83, 83, 70.13, 86.91, 90.13, 93.24];
  const data2025 = [75.13, 83, 88.83, 87.13, 88.1, 93.24, 94.91];

  const option = {
    grid: {
      left: "2%",
      right: "5%",
      bottom: "5%",
      top: "15%",
      containLabel: true,
    },
    legend: {
      data: ["Target PNBP", "Jumlah Realisasi PNBP"],
      bottom: "bottom",
      left: "center",
      icon: "circle",
      textStyle: {
        color: "#555",
        fontSize: 12,
      },
    },
    xAxis: {
      type: "value",
      show: false,
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: eselons,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: "#000000" },
    },
    series: [
      {
        name: "Target PNBP",
        type: "bar",
        data: data2024,
        itemStyle: {
          color: "#2F8AFD",
        },
        barWidth: "25%",
        barGap: "30%", // jarak antar seri
      },
      {
        name: "Jumlah Realisasi PNBP",
        type: "bar",
        data: data2025.map((val, idx) => ({
          value: val,
        })),
        itemStyle: {
          color: "#FC0166",
        },
        barWidth: "25%",
        barGap: "30%",
      },
    ],
    animationDuration: 800,
  };

  return (
    <div className={`w-full ${height} mb-4`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
