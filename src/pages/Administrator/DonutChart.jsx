import React from "react";
import ReactECharts from "echarts-for-react";

export default function DonutChart({ height = "h-64", dataset, colors }) {
  const option = {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <b>{c}</b> ({d}%)', // Format: Nama: Nilai (Persen%)
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textStyle: { color: '#374151' },
      borderWidth: 0,
      extraCssText: 'box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px;'
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "85%"], // Ukuran donut yang lebih pas
        avoidLabelOverlap: false,
        minAngle: 15,
        center: ["50%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 4, // Memberi jarak antar potongan
        },
        data: dataset,
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} notMerge  />
    
    </div>
  );
}