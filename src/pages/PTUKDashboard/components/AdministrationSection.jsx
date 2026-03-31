import Card from "@/components/Card";
import { Flame, MessageSquareText } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { PTUKCard } from "./PTUKCard";
import { formatCurrency } from "@/services/GeneralHelper";

export const AdminstrationSection = () => {
  return (
    <div>
      <Card
        className="h-fit"
        icon={
          <MessageSquareText
            size={26}
            fill="#2F8AFD"
            color="#D5F1FF"
            strokeWidth={2}
          />
        }
        color="bg-blue-bg"
        title="Pengelolaan Keuangan"
      >
        <div className="flex w-full gap-4 items-center place-content-center">
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
        <div className="flex justify-evenly gap-4 my-4">
          {CardData &&
            CardData.map((val) => (
              <PTUKCard
                title={val?.title}
                color={val?.color}
                icon={
                  <Flame
                    size={26}
                    color={val?.secondaryColor}
                    strokeWidth={2}
                  />
                }
                value={155}
                className={"shadow-lg min-w-[18vw]"}
              />
            ))}
        </div>
        <div className="flex w-full gap-4 items-center place-content-center">
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
      </Card>
    </div>
  );
};

const CardData = [
  {
    title: "Pejabat Pembuat Komitmen",
    secondaryColor: "#FFFFFF",
    color: "bg-red-text",
  },
  {
    title: "Pejabat Penandatangan SPM",
    secondaryColor: "#FFFFFF",
    color: "bg-green-text",
  },
  {
    title: "Bendahara Pengeluaran",
    secondaryColor: "#FFFFFF",
    color: "bg-orange-text",
  },
  {
    title: "Bendahara Penerimaan",
    secondaryColor: "#FFFFFF",
    color: "bg-blue-text",
  },
];
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
