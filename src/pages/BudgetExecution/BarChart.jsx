import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChartHorizontal({
  height = "h-72",
  labels = [],
  values = [],
}) {
  const val = values.slice().reverse();
  const option = {
    grid: {
      top: 20,
      right: 0,
      bottom: 20,
      left: 10,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
        fontSize: 12,
      },
      splitLine: { show: true, lineStyle: { color: "#f0f0f0" } },
      axisLine: { show: false },
      axisTick: { show: false },
      nameTextStyle: { fontSize: 14 },
    },
    yAxis: {
      type: "category",
      // data: labels.slice().reverse(),
      data: labels,
      axisLabel: { fontSize: 12 },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        type: "bar",
        data:
          val.length > 0 &&
          val.map((val) => ({
            value: val,
            itemStyle: {
              color: "#59C7FF",
            },
            label: {
              show: true,
              position: "right",
              formatter: `${val.toFixed(1)}%`,
              backgroundColor: "#fff",
              padding: [4, 8],
              color: "#333",
              fontSize: 12,
            },
          })),
        barWidth: "40%",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const data = params[0];
        return `${data.name}: <b>${data.value.toFixed(2)}%</b>`;
      },
    },
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
