import React from "react";
import ReactECharts from "echarts-for-react";

export default function GenericBarChart({
  title,
  data2024,
  data2025,
  categories,
  height = "210px",
  tableHeaders = ["Tahun", "Data 1", "Data 2", "Data 3"], // Default headers
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
        show: true, // garis di 0
        onZero: true,
        lineStyle: { color: "#D1D5DB" }
      },
      axisTick: { show: false },
      axisLabel: { show: true, fontSize: 11, color: "#6B7280",interval: 0 },
    },
    yAxis: { type: "value", show: false },
    series: [
      {
        name: "2024",
        type: "bar",
        data: data2024,
        barWidth: "28%",
        itemStyle: { color: "#FFBE02", borderRadius: [ 0] },
      },
      {
        name: "2025",
        type: "bar",
        data: data2025,
        barWidth: "28%",
        itemStyle: { color: "#59C7FF", borderRadius: [0, 0, 0, 0] },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl  flex flex-col gap-4 ">
      {/* HEADER: Judul & Bunderan Legenda */}
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-bold text-gray-800 max-w-[60%] ">
          {title}
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-[11px] font-bold text-gray-600">2025</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F6B41B]"></div>
            <span className="text-[11px] font-bold text-gray-600">2024</span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-md border border-gray-300 overflow-hidden">
        <table className="w-full text-[11px] border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header, i) => (
                <th key={i} className="px-2 py-2 border border-gray-300 text-center font-bold text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-2 border border-gray-300 text-center font-bold">2024</td>
              {data2024.map((val, i) => (
                <td key={i} className={`px-2 py-2 border border-gray-300 text-right ${val < 0 ? 'text-red-500 font-semibold' : ''}`}>
                  {val.toLocaleString("id-ID")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-2 py-2 border border-gray-300 text-center font-bold">2025</td>
              {data2025.map((val, i) => (
                <td key={i} className={`px-2 py-2 border border-gray-300 text-right ${val < 0 ? 'text-red-500 font-semibold' : ''}`}>
                  {val.toLocaleString("id-ID")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* CHART SECTION */}
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