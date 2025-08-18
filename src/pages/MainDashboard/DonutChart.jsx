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
  height = "h-72", // Tailwind height: h-64 / h-72 / h-80
}) {
  const option = {
    color: ["#616484", "#47B5FF", "#EDFF00"], // blue, dark purple, yellow (example)
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
        label: {
          show: false, // ❌ hide percentage labels
        },
        labelLine: {
          show: false,
        },

        itemStyle: {
          borderRadius: 1, // ❌ remove rounded corners
          borderColor: "#fff",
          borderWidth: 2,
        },
        data: [
          { value: 1399, name: "TL Status Sesuai" },
          { value: 655, name: "TL Status belum Sesuai" },
          { value: 18, name: "TPTD" },
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
