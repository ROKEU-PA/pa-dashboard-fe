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
import { AssetConditions, dataTable } from "./constants";
import Select from "@/components/Select";
import { TableStateProperty } from "./Table";

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
          <div className="grid grid-cols-[90%_10%] items-center mb-4">
            <span className="font-bold text-xl">
              PNBP yang Berkaitan dengan Aset
            </span>
            <Select
              placeholder=""
              innerHeight="3rem"
              name="year"
              value="2025"
              options={[
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
              ]}
            />
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
              {AssetConditions.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span className="text">{item.title}</span>
                  </div>
                  <span className={`text-3xl font-semibold `}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="flex flex-col col-span-2">
          <span className="text-xl font-bold color-[#B7B7B7] mb-4">
            Rincian Konsisi Aset per Eselon 1
          </span>
          <TableStateProperty dataTable={dataTable} />
        </Card>
      </div>
    </div>
  );
}

export default StateProperty;
