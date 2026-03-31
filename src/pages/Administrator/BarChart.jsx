import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({
  height = "h-72",
  dataset,
  isGajiChart = false,
}) {
  const labels = dataset?.labels || [];
  const values = dataset?.values || [];

  const option = {
    grid: {
      top: "10%",
      right: "2%",
      bottom: "15%",
      left: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      // MENAMPILKAN LINE KECIL DI SUMBU X (BULAN)
      axisTick: { 
        show: true, 
        alignWithLabel: true, // Memastikan garis lurus di tengah batang
        lineStyle: { color: "#000000" } 
      },
      axisLine: { 
        show: false, 
      },
      axisLabel: { fontSize: 10, color: "#000000" },
    },
    yAxis: {
      type: "value",
      splitLine: { 
        show: false, 
        lineStyle: { 
          type: "solid", 
          color: "#e8e8e8" 
        } 
      },
      axisLine: { show: false },
      // ANGKA SAMPING 
      axisLabel: { 
        show: true, 
        fontSize: 10, 
        color: "#000000" 
      },
      axisTick: { 
        show: true, 
        alignWithLabel: true, // Memastikan garis lurus di tengah batang
        lineStyle: { color: "#000000" } 
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "none",
      shadowBlur: 0,
      borderWidth: 0,
      extraCssText: "box-shadow: none;",
      formatter: function (params) {
        let statusText = "";

        if (isGajiChart) {
          statusText = `GAJI ${params.name}`;
        } else {
          // Logika untuk IKK:
          // Jika index 0 biasanya Target (abu-abu), index 1 Realisasi (biru)
          statusText =
            params.dataIndex === 0
              ? `TARGET ${params.name}`
              : `REALISASI ${params.name}`;
        }

        return `<div style="color: #374151; font-weight: bold; font-size: 13px; text-align: center; line-height: 1.2;">
                  <span style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; display: block; margin-bottom: 2px;">
                    ${statusText}
                  </span>
                  ${params.value}
                </div>`;
      },
    },
    series: [
      {
        type: "bar",
        data: values.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: isGajiChart
              ? "#5CC2F6"
              : idx === values.length - 1
              ? "#5CC2F6"
              : "#e8e8e8",
            borderRadius: [4, 4, 0, 0],
          },
          // Efek warna saat kursor mengarah
          emphasis: {
            itemStyle: {
              color:
                isGajiChart || idx === values.length - 1
                  ? "#1E90FF" // Biru Tua (Pekat)
                  : "#9CA3AF", // Abu-abu Tua (Pekat)
            },
          },
        })),
        barWidth: isGajiChart ? "60%" : "40%",
        emphasis: {
          scale: true, // Membuat batang membesar
          focus: "none", // Memastikan batang lain tidak memudar (tetap terlihat jelas)
        },
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        lazyUpdate={true}
      />
    </div>
  );
}
