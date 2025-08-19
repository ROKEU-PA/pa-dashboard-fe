import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import { Database } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import moment from "moment";
import { formatCurrency } from "@/services/GeneralHelper";
import User from "@/components/User";

function StateProperty() {
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
          items={[
            { name: "Barang Milik Negara", path: "/barang-milik-negara" },
          ]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Barang Milik Negara</Title>
      <div className="grid grid-cols-[55%_45%] gap-4 mr-4">
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-xl">
              PNBP yang Berkaitan dengan Aset
            </span>
          </div>
          <div className="items-center">
            <BarChart data={dataset} height="h-72" />
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Kondisi Aset
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <DonutChart data={dataset} height="h-72" />
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
        <Card className="flex col-span-2"> asd</Card>
      </div>
    </div>
  );
}

export default StateProperty;
