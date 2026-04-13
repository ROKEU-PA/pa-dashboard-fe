import React from "react";
import ReactECharts from "echarts-for-react";
import { formatNumberID } from "@/utils/number";

export default function BarChart({
  height = "h-72",
  years = [2020, 2021, 2022, 2023, 2024, 2025, 2026],
  values = [
    530215012206, 480215068205, 244215029205, 348215014206, 456215079203,
    657215037207, 774362202150,
  ],
}) {
  const option = {
    grid: {
      top: 30,
      right: 0,
      bottom: 30,
      left: 35,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      gridIndex: 0,
      data: years,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: {
        fontSize: 14,
        fontFamily: "Funnel Display",
      },
      axisLabel: {
        fontSize: 12,
        margin: 10,
      },

      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data:
          values.length > 0 &&
          values.map((val) => ({
            value: val,
            itemStyle: {
              color: "#59C7FF",
            },
            label: {
              show: true,
              position: "top",
              formatter: `${formatNumberID(val)}`,
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
      axisPointer: {
        type: "shadow",
      },
    },
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
