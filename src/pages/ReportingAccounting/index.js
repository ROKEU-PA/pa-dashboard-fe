import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import BarChart from "./BarChart";
import moment from "moment";
import { formatCurrency } from "@/services/GeneralHelper";
import User from "@/components/User";

function ReportingAccounting() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];

  const trophies = [
    { year: 2020, label: "WTP", img: "/trophy-gold.png" },
    { year: 2021, label: "WDP", img: "/trophy-silver.png" },
    { year: 2022, label: "WTP", img: "/trophy-gold.png" },
    { year: 2023, label: "WTP", img: "/trophy-gold.png" },
    { year: 2024, label: "WTP", img: "/trophy-gold.png" },
    {
      year: 2025,
      label: "Coming Soon",
      img: "/trophy-black.png",
      comingSoon: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[{ name: "Dashboard Utama", path: "/dashboard" }]}
        />
        <User name={"Test"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Akuntansi Pelaporan</Title>
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <h2 className="font-bold text-2xl mb-4">
            Opini Badan Pemeriksa Keuangan
          </h2>
          <div className="grid grid-cols-4 gap-y-8 justify-items-center">
            {trophies.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <span className="text-sm text-gray-500">{item.year}</span>

                <div className="relative flex items-center justify-center">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-25 h-25 object-contain"
                  />
                </div>

                <span
                  className={`font-semibold text-base ${
                    item.comingSoon ? "italic text-gray-600" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-2xl mb-4">
                Nilai Maturitas SPIP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center ml-3 mt-12">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-gradient-to-tr from-[#C2C3C8] to-[#CCC] rounded-2xl text-center h-[180px] w-[260px] flex items-center justify-center">
                <span className="text-[85px] font-black text-white scale-y-150">
                  3.92
                </span>
              </div>
              <span className="text-lg">Nilai SPIP Tahun 2024</span>
            </div>

            {/* Garis putus-putus */}
            <div className="h-[250px] border-l-2 border-dashed border-gray-300 mx-8"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center h-[180px] w-[260px] flex items-center justify-center">
                <span className="text-[85px] font-black text-white scale-y-150">
                  3.93
                </span>
              </div>
              <span className="text-lg">Target Nilai SPIP Tahun 2025</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid mt-4 gap-4">
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-2xl">LRA 30 Juni 2025 dan 30 Juni 2024</span>
            </div>
          </div>
          <div className="grid grid-cols-[65%_35%] gap-2 items-center">
            <div className="grid grid-cols-[80%_20%] items-center">
              <BarChart data={dataset} height="h-56" />
              <div className="flex flex-col">
                <div className="w-3 h-3 bg-[#296CF8]"></div>
                <span className="text-sm">Jul 2025</span>
                <span className="text-xl font-bold">3.59</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReportingAccounting;
