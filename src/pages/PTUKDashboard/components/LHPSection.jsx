import Card from "@/components/Card";
import { MessageSquareText } from "lucide-react";
import ReactECharts from "echarts-for-react";

export const LHPSection = ({
  title = "LHP Kementrian",
  subCaption,
  details,
  children,
}) => {
  return (
    <div>
      <Card
        className="h-fit"
        icon={
          <MessageSquareText
            size={26}
            fill="#BCDD51"
            color="#ECFDF3"
            strokeWidth={2}
          />
        }
        details={details}
        subCaption={subCaption}
        color="bg-[#ECFDF3]"
        title={title}
      >
        <div className="flex flex-col gap-4">
          <div className="flex w-full gap-4 items-center place-content-center">
            <div className="h-48 w-64">
              <ReactECharts
                option={option}
                style={{ height: "100%", width: "100%" }}
                notMerge
                lazyUpdate
              />
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2">
              <div className="flex flex-col px-4 sm:px-8 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-blue-text rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">Jumlah Temuan</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  2072
                </span>
              </div>
              <div className="flex flex-col px-4 sm:px-8 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-red-text rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TL Status Belum Selesai</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  655
                </span>
              </div>
              <div className="flex flex-col px-4 sm:px-8 min-w-0 self-center">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-gray-500 rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TPTD</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  18
                </span>
              </div>
              <div className="flex flex-col p-4 min-w-0 bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] rounded-lg text-white">
                <div className="flex gap-2 items-center mb-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0`} />
                  <span className="truncate">Total Rekomendasi</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  1222
                </span>
              </div>
            </div>
          </div>
          {children}
        </div>
      </Card>
    </div>
  );
};

const option = {
  color: ["#616484", "#47B5FF", "#FC0166"], // blue, dark purple, yellow (example)
  legend: {
    show: false,
  },
  title: {
    show: false,
  },
  grid: {
    left: "0",
    right: "0",
    bottom: "0",
    top: "10%",
    containLabel: true,
  },

  series: [
    {
      type: "pie",
      radius: ["35%", "75%"], // inner and outer radius → bigger hole
      avoidLabelOverlap: false,
      center: ["50%", "50%"],
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
        { value: 199, name: "TL Status Sesuai" },
        { value: 655, name: "TL Status belum Sesuai" },
        { value: 400, name: "TPTD" },
      ],
    },
  ],
};
