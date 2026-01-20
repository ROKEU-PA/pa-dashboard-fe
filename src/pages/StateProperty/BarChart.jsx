import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({
  height = "h-72",
  years = [],
  values = [], 
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
      name: "Juta",
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
              color: "#59c7ff", 
              borderRadius: [0, 0, 0, 0],
            },
            label: {
              show: true,
              position: "top",
              formatter: val.toFixed(2),
              backgroundColor: "#fff",
              padding: [4, 8],
              borderRadius: 6,
              color: "#333",
              fontWeight: "normal",
              shadowColor: "rgba(0,0,0,0.1)",
              shadowBlur: 4,
            },
          })),
        barWidth: "40%",
      },
      {
        name: "Trend",
        type: "line", 
        data: values, 
        smooth: true, 
        lineStyle: {
          color: "#FF7043",
          width: 2,
        },
        itemStyle: {
          color: "#FF7043",
        },
        symbol: "circle", 
        symbolSize: 6,
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
