import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import { Database } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import moment from "moment";
import BarChartIPA from "./BarChartIPA";
import DonutChartAkuntansi from "./DonutChartAkuntansi";
import { formatCurrency } from "@/services/GeneralHelper";
import User from "@/components/User";

function MainDashboard() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[{ name: "Dashboard Utama", path: "/dashboard" }]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Utama</Title>
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="bg-[#D4F0B2] rounded-full content-center p-2 ">
                <Database size={20} color="#6FCE00" />
              </div>
              <span className="font-bold">PTUK</span>
            </div>
            <span className="text-base color-[#B7B7B7]">
              Pengelolaan Keuangan
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <DonutChart data={dataset} height="h-56" />
            <div className="grid grid-cols-2 ">
              <div key="info" className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#c0c0c0]"></div>
                  <span className="text">Jumlah Temuan</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  2072
                </span>
              </div>
              <div key="info" className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#47B5FF]"></div>
                  <span className="text-sm">TL Status Belum Selesai</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  655
                </span>
              </div>
              <div key="info" className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#EDFF00]"></div>
                  <span className="text-sm">TPTD</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  18
                </span>
              </div>
              <div key="info" className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-[#616484]"></div>
                  <span className="text-sm">TL Status Sesuai</span>
                </div>
                <span className="text-[40px] ml-4 font-extrabold  leading-none">
                  1399
                </span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="bg-[#F0DCB2] rounded-full content-center p-2 ">
                <Database size={20} color="#CF8E07" />
              </div>
              <span className="font-bold">Pelaksanaan Anggaran</span>
            </div>
            <span className="text-base color-[#B7B7B7]">
              Nilai IKPA dan Target Tahun {moment().format("YYYY")}
            </span>
          </div>
          <div className="grid grid-cols-[65%_35%] gap-2 items-center">
            <div className="grid grid-cols-[80%_20%] items-center">
              <BarChart data={dataset} height="h-56" />
              <div className="flex flex-col">
                <div className="w-3 h-3 bg-[#296CF8]"></div>
                <span className="text-sm">Jul 2025</span>
                <span className="text-xl font-bold">95.25</span>
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center">
                <span className="text-[85px]  font-black text-white">94</span>
              </div>
              <span className="font-bold text-sm ">
                Target Nilai IKPA Kemnaker 2025
              </span>
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="bg-[#B2BFF0] rounded-full content-center p-2 ">
                <Database size={20} color="#002ACE" />
              </div>
              <span className="font-bold">Barang Milik Negara</span>
            </div>
            <span className="text-base color-[#B7B7B7]">
              Nilai IPA dan Target Tahun {moment().format("YYYY")}
            </span>
          </div>
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
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="bg-[#F0B2B4] rounded-full content-center p-2 ">
                <Database size={20} color="#CE0007" />
              </div>
              <span className="font-bold">Akuntansi dan Pelaporan</span>
            </div>
            <span className="text-base color-[#B7B7B7]">
              Realisasi Anggaran
            </span>
          </div>
          <div className="grid grid-cols-[30%_40%_25%] gap-2">
            <DonutChartAkuntansi data={dataset} height="h-64" />
            <div className="flex flex-col my-10 justify-evenly">
              <div key="info" className="flex  items-center">
                <div className="w-1 h-12 bg-[#616484]"></div>
                <div className="flex gap-2 flex-col ml-2">
                  <span className="text-xl font-bold">Total Pagu</span>
                  <span className=" text-xl font-semibold leading-none">
                    {formatCurrency("15261272133000")}
                  </span>
                </div>
              </div>
              <div key="info" className="flex  items-center">
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
