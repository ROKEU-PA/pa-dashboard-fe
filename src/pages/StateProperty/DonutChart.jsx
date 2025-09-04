import React from "react";
import ReactECharts from "echarts-for-react";

/**
 * props:
 * - title?: string
 * - subtitle?: string
 * - data: Array<{ name: string; value: number }>
 * - height?: string (Tailwind or inline height)
 */
export default function DonutChart({
  height = "h-72",
  good = 0,
  mid = 0,
  damage = 0, // Tailwind height: h-64 / h-72 / h-80
}) {
  const option = {
    color: ["#616484", "#47B5FF", "#FF0000"], // blue, dark purple, yellow (example)
    legend: {
      orient: "horizontal",
      bottom: "-2%",
    },
    title: {
      show: false, // pastikan tidak ada title
    },

    series: [
      {
        type: "pie",
        radius: ["35%", "75%"], // inner and outer radius → bigger hole
        avoidLabelOverlap: false,
        center: ["50%", "40%"],
        minAngle: 5, // ✅ tambahkan ini
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{d}%", // nama dan persentase
        },
        labelLine: {
          show: true,
        },

        itemStyle: {
          borderRadius: 1, // ❌ remove rounded corners
          borderColor: "#fff",
          borderWidth: 2,
        },
        data: [
          { value: `${good}`, name: "Baik" },
          { value: `${mid}`, name: "Rusak Berat" },
          { value: `${damage}`, name: "Rusak Ringan" },
        ],
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
