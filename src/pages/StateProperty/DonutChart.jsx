import React from "react";
import ReactECharts from "echarts-for-react";

export default function DonutChart({
  height = "h-52",
  data = [], 
   
}) {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      show: false, 
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        center :["50%", "40%"],
        radius : ["30%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false, 
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };

  return (
    <div className={`w-full ${height}`}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        // notMerge={true}
      />
    </div>
  );
}