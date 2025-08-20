import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({
  height = "h-72", // Tailwind height: h-64 / h-72 / h-80
  dataset,
}) {
  const years = dataset.labels;
  const values = dataset.values;

  const option = {
    grid: {
      top: 30, // distance from top
      right: 0, // distance from right
      bottom: 30, // distance from bottom
      left: 35, // distance from left
      containLabel: true, // make sure labels are inside the chart
    },
    xAxis: {
      type: "category",
      gridIndex: 0,
      data: years,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12, show: false },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      nameGap: 45, // increase spacing between axis name and labels
      nameTextStyle: {
        fontSize: 14,
        fontFamily: "Funnel Display",
      },
      // min: 0,
      // max: 100,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: "bar",
        data:
          values.length > 0 &&
          values?.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: idx === values.length - 1 ? "#2979FF" : "#ccc",
              borderRadius: [10, 10, 0, 0],
            },
            label: {
              show: true,
              position: "top",
              formatter: val.toFixed(2),
              backgroundColor: "#fff",
              padding: [4, 8],
              borderRadius: 6,
              color: idx === values.length - 1 ? "#2979FF" : "#333",
              fontWeight: idx === values.length - 1 ? "bold" : "normal",
              shadowColor: "rgba(0,0,0,0.1)",
              shadowBlur: 4,
            },
          })),
        barWidth: "40%",
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
