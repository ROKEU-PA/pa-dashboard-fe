import React from "react";
import ReactECharts from "echarts-for-react";

export default function StateLossesChart({ height = "h-[30rem]" }) {
  const eselons = [
    "DITJEN BINAPENTA & PKK",
    "DITJEN BINALAVOTAS",
    "DITJEN BINWASNAKER & K3",
    "SEKERTARIAT JENDERAL",
    "DITJEN PHI & JAMSOS",
    "BARENBANG",
    "ITJEN",
    "DITJEN BINALAVOTAS (Euro)",
  ];
  const data2024 = [71.13, 81.83, 83, 70.13, 86.91, 90.13, 93.24, 88];
  const data2025 = [75.13, 83, 88.83, 87.13, 88.1, 93.24, 94.91, 76];

  const option = {
    grid: {
      left: "2%",
      right: "5%",
      bottom: "5%",
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
        name: "Tahun 2024",
        type: "bar",
        data: data2024,
        itemStyle: {
          color: "#BCDD51",
        },
        barWidth: "25%",
        barGap: "30%", // jarak antar seri
      },
      {
        name: "Tahun 2025",
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
