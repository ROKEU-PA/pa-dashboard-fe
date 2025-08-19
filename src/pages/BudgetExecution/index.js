import React from "react";
import Title from "@/components/Title";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import User from "@/components/User";
import IKPAChart from "./GaugeChart";
import moment from "moment";
import "moment/locale/id";
import { dashboardCards, dataTable } from "./constants";
import { NotepadText } from "lucide-react";
import { TableBudgetExecution } from "./TableBudgetExecution";

function BudgetExecution() {
  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Pelaksanaan Anggaran", path: "/pelaksanaan-anggaran" },
          ]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Pelaksanaan Anggaran</Title>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Card className="row-span-2">
          <div className="flex flex-col items-center ">
            <span className="font-bold text-2xl text-center">NILAI IKPA</span>
            <IKPAChart height={"h-48"} />
            <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center px-6 pb-1 absolute top-[22rem]">
              <span className="font-bold text-sm text-center text-white ">
                Bulan {moment().locale("id").format("MMMM")}
              </span>
            </div>
            <span className="font-bold text-sm text-center">
              Kementrian Ketenagakerjaan
            </span>
          </div>
        </Card>
        {dashboardCards.map((item, index) => (
          <Card className="p-3" key={index}>
            <div className="flex flex-col">
              <div className="flex justify-between items-center h-10">
                <span className="font-bold text-base w-[200px]">
                  {item.title}
                </span>
                <div className={`${item.color} rounded-lg p-1`}>
                  <NotepadText color="white" />
                </div>
              </div>
            </div>
            <span className="text-[50px] font-black text-blue-500">
              {item.value}
            </span>
          </Card>
        ))}
        <div className="flex flex-col justify-between">
          <span className="font-bold">Indikator Warna</span>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#6FCE00]"></div>
            <span className="text-sm">
              Nilai IKPA ≥
              90&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Sangat Baik</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#2E70FD]"></div>
            <span className="text-sm">
              {"89 ≤ Nilai IKPA < 95"}&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Baik</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#ECFD2E]"></div>
            <span className="text-sm">
              {"70 ≤ Nilai IKPA < 89"}&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Cukup</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#FF4155]"></div>
            <span className="text-sm">
              {"Nilai IKPA < 70"}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Kurang</span>
          </div>
        </div>
      </div>
      <TableBudgetExecution dataTable={dataTable} />
    </div>
  );
}

export default BudgetExecution;
