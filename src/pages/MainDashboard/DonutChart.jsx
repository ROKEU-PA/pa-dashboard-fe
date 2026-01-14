import React from "react";
import ReactECharts from "echarts-for-react";
export default function DonutChart({
  height = "h-72", // Tailwind height: h-64 / h-72 / h-80
}) {
  const option = {
    color: ["#616484", "#47B5FF", "#EDFF00"], // blue, dark purple, yellow (example)
    legend: {
      show: false,
    },
    title: {
      show: false,
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
    <div className={`w-full ${height} mb-[-2rem]`}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
