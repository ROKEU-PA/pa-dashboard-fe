import React from "react";
import Card from "@/components/Card";
import { Building2, Landmark, Leaf, SquareKanban } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import moment from "moment";
import BarChartIPA from "./BarChartIPA";
import DonutChartAkuntansi from "./DonutChartAkuntansi";
import { formatCurrency } from "@/services/GeneralHelper";

function MainDashboard() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="h-[41vh]"
          icon={<Leaf size={26} color="#6FCE00" strokeWidth={3} />}
          color={"bg-[#D4F0B2]"}
          title={"PTUK"}
          subCaption="Pengelola Keuangan"
        >
          <div className="flex flex-col gap-2 px-[8rem]">
            <DonutChart data={dataset} height="h-48" />
            <div className="grid grid-cols-2">
              <div key="info_1" className="flex flex-col px-8 ">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#c0c0c0] rounded-full"></div>
                  <span className="text">Jumlah Temuan</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  2072
                </span>
              </div>
              <div key="info_2" className="flex flex-col px-8">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#47B5FF] rounded-full"></div>
                  <span className="text-sm">TL Status Belum Selesai</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  655
                </span>
              </div>
              <div key="info_3" className="flex flex-col px-8">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#EDFF00] rounded-full"></div>
                  <span className="text-sm">TPTD</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  18
                </span>
              </div>
              <div key="info_5" className="flex flex-col px-8">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#616484] rounded-full"></div>
                  <span className="text-sm">TL Status Sesuai</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  1222
                </span>
              </div>
            </div>
          </div>
        </Card>
        <Card
          className="h-[41vh]"
          icon={<Landmark size={26} color="#FC0166" strokeWidth={3} />}
          color={"bg-[#FFCFE2]"}
          title={"Pelaksanaan Anggaran"}
          subCaption={`Nilai IKPA dan Target Tahun  ${moment().format("YYYY")}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] items-center">
            <div className="grid grid-cols-[90%_10%] items-center">
              <BarChart data={dataset} height="h-72" />
            </div>
            <div className="flex gap-2 flex-col ">
              <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center mr-10">
                <span className="text-[85px] font-black text-white">94</span>
              </div>
              <span className="font-bold text-sm ">
                Target Nilai IKPA Kemnaker 2025
              </span>
            </div>
          </div>
        </Card>
        <Card
          className="h-[41vh]"
          icon={<Building2 size={26} color="#FFBC00" strokeWidth={3} />}
          color={"bg-[#FFF3D0]"}
          title={"Barang Milik Negara"}
          subCaption={`Nilai IPA dan Target Tahun ${moment().format("YYYY")}`}
        >
          <div className="grid grid-cols-[65%_35%] gap-2 items-center">
            <div className="grid grid-cols-[80%_20%] items-center">
              <BarChartIPA data={dataset} height="h-56" />
              <div className="flex flex-col">
                <div className="w-3 h-3 bg-[#296CF8]"></div>
                <span className="text-sm">Jul 2025</span>
                <span className="text-xl font-bold">3.59</span>
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center">
                <span className="text-[85px] font-black text-white">3.2</span>
              </div>
              <span className="font-bold text-sm ">
                Target Nilai IPA Kemnaker 2025
              </span>
            </div>
          </div>
        </Card>
        <Card
          className="h-[41vh]"
          icon={<SquareKanban size={26} color="#59C7FF" strokeWidth={3} />}
          color={"bg-[#D5F1FF]"}
          title={"Akuntansi dan Pelaporan"}
          subCaption={`Realisasi Anggaran`}
        >
          <div className="grid md:grid-cols-2 grid-cols-[30%_40%_25%] gap-2">
            <DonutChartAkuntansi data={dataset} height="h-64" />
            <div className="flex flex-col my-10 justify-evenly">
              <div key="info_card_1" className="flex  items-center">
                <div className="w-1 h-12 bg-[#616484]"></div>
                <div className="flex gap-2 flex-col ml-2">
                  <span className="text-xl font-bold">Total Pagu</span>
                  <span className=" text-xl font-semibold leading-none">
                    {formatCurrency("15261272133000")}
                  </span>
                </div>
              </div>
              <div key="info_crd_2" className="flex  items-center">
                <div className="w-1 h-12 bg-[#43AAF0]"></div>
                <div className="flex gap-2 flex-col ml-2">
                  <span className="text-xl font-bold">Realisasi</span>
                  <span className=" text-xl font-semibold leading-none">
                    {formatCurrency("10681709121207")}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-red-500 rounded-lg text-center flex p-2 flex-col self-center">
              <span className="font-black text-[12px] text-white ">Blokir</span>
              <span className="font-semibold text-[14px] text-white">
                {formatCurrency("1829252330000")}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MainDashboard;
