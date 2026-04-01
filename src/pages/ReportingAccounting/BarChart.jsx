import React from "react";
import ReactECharts from "echarts-for-react";

export default function BarChart({
  title,
  data2024 = [],
  data2025 = [],
  categories = [],
  height = "210px",
}) {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        let res = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((item) => {
          res += `${item.marker} ${
            item.seriesName
          }: ${item.value.toLocaleString("id-ID")}<br/>`;
        });
        return res;
      },
    },
    grid: {
      left: "4%",
      right: "4%",
      top: "10%",
      bottom: "18%",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: {
        show: true,
        onZero: true,
        lineStyle: { color: "#D1D5DB" }
      },
      axisTick: { show: false },
      axisLabel: { show: true, fontSize: 11, color: "#6B7280", interval: 0 },
    },
    yAxis: { type: "value", show: false },
    series: [
      {
        name: "2024",
        type: "bar",
        data: data2024,
        barWidth: "28%",
        itemStyle: { color: "#FFBE02" },
      },
      {
        name: "2025",
        type: "bar",
        data: data2025,
        barWidth: "28%",
        itemStyle: { color: "#59C7FF" },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <h3 className="text-sm font-bold max-w-[60%]">
          {title}
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#59C7FF]"></div>
            <span className="text-[11px] md:text-[12px] font-bold text-gray-600">2025</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFBE02]"></div>
            <span className="text-[11px] md:text-[12px] font-bold text-gray-600">2024</span>
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="rounded-md border border-gray-300 overflow-x-auto">
        <table className="w-full text-[11px] md:text-[12px] border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 border border-gray-300 text-center font-bold">
                Tahun
              </th>
              {categories.map((cat, i) => (
                <th key={i} className="px-2 py-2 border border-gray-300 text-center font-bold ">
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-2 border border-gray-300 text-center font-bold">2024</td>
              {categories.map((_, i) => (
                <td key={i} className={`px-2 py-2 border border-gray-300 text-right ${data2024[i] < 0 ? 'text-red-500 font-semibold' : ''}`}>
                  {(data2024[i] || 0).toLocaleString("id-ID")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-2 py-2 border border-gray-300 text-center font-bold">2025</td>
              {categories.map((_, i) => (
                <td key={i} className={`px-2 py-2 border border-gray-300 text-right ${data2025[i] < 0 ? 'text-red-500 font-semibold' : ''}`}>
                  {(data2025[i] || 0).toLocaleString("id-ID")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {/* CHART*/}
      <div style={{ width: "100%", height: height, minHeight: "200px" }}>
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "100%" }}
          notMerge={true}
        />
      </div>
    </div>
  );
}