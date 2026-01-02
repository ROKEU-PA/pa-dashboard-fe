import React from "react";
import ReactECharts from "echarts-for-react";

export default function IKPAChart({ height, val }) {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        radius: "100%",
        center: ["50%", "70%"],
        min: 0,
        margin: 0,
        max: 100,
        progress: {
          show: true,
          width: 14,
          itemStyle: {
            color: "#2563EB", // blue
            borderCap: "round",
          },
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, "#E5E7EB"]], // gray background
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: {
          show: false,
        },
        anchor: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          fontSize: 42,
          fontFamily: "Funnel Display, sans-serif",
          fontWeight: "bold",
          color: "#111827",
          offsetCenter: [0, "-20%"], // closer to exact center
          formatter: "{value}",
        },

        data: [
          {
            value: val,
          },
        ],
      },
    ],
  };

  return (
    <div className={`${height} w-full bg-white rounded-2xl`}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
