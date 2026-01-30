import ReactECharts from "echarts-for-react";

export const PieCharts = () => {
  return (
    <div className="flex w-full gap-4 items-center place-content-center mb-4">
      <div className="h-48 w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          lazyUpdate
        />
      </div>
      <div className="h-48 w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          lazyUpdate
        />
      </div>
      <div className="h-48 w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          lazyUpdate
        />
      </div>
      <div className="h-48 w-full">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          lazyUpdate
        />
      </div>
    </div>
  );
};

const option = {
  legend: {
    orient: "vertical",
    right: -50,
  },
  color: [
    "#616484",
    "#47B5FF",
    "#FC0166",
    "#FFBE02",
    "#BCDD51",
    "#6155F5",
    "#000000",
  ], // blue, dark purple, yellow (example)
  title: {
    show: false,
  },

  series: [
    {
      type: "pie",
      // radius: ["35%", "%"], // inner and outer radius → bigger hole
      // avoidLabelOverlap: false,
      center: ["30%", "50%"],
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
        { value: 199, name: "BINAlAVOTAS" },
        { value: 655, name: "BINWASNAKER" },
        { value: 400, name: "SEKERTARIAT JENDERAL" },
        { value: 199, name: "BINAPENTA" },
        { value: 655, name: "PHI" },
        { value: 400, name: "BARENBANG" },
        { value: 400, name: "INSPEKTORAT" },
      ],
    },
  ],
};
