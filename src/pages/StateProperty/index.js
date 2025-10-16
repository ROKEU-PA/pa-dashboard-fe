import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import { Database } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import moment from "moment";
import { formatCurrency, formatNumber } from "@/services/GeneralHelper";
import User from "@/components/User";
import { AssetConditions, dataTable } from "./constants";
import Select from "@/components/Select";
import { TableStateProperty } from "./Table";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";

function StateProperty() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];
  const { userData } = useContext(AppContext);
  const [assetEs1, setAssetEs1] = useState({ columns: [], data: [] });
  const [condAsset, setCondAsset] = useState([]);
  const [months, setMonth] = useState([]);
  const [values, setValues] = useState([]);
  const [selectOpen, setSelectOpen] = useState(false);
  const [year, setYear] = useState("2025");

  const assetData = async () => {
    try {
      const data = await apiRequest({
        url: `/api/bmn/asset`,
      });
      const list = data?.data;

      const mapped = list.map((item, index) => {
        const constantItem = dataTable?.data?.[index];

        return {
          ...item,
          name: constantItem?.name || item.name,
        };
      });

      setAssetEs1({
        columns: dataTable.columns,
        data: mapped,
      });

      setCondAsset(data?.asset_condition);
    } catch (error) {
      console.error(error);
    }
  };

  const pnbpGraph = async () => {
    try {
      const data = await apiRequest({
        url: `/api/bmn/pnbp?tahun=` + year,
      });
      setMonth(
        data?.data?.years.length === 0
          ? [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]
          : data?.data?.years
      );
      setValues(
        data?.data?.values.length === 0
          ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          : data?.data?.values.map((v) => Number(v))
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    assetData();
    pnbpGraph();
  }, [year]);

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
        {/* <Card className="">
          <div className="grid grid-cols-[90%_10%] items-center mb-4">
            <span className="font-bold text-xl">
              PNBP yang Berkaitan dengan Aset
            </span>
            <Select
              isOpen={selectOpen}
              setIsOpen={setSelectOpen}
              placeholder=""
              innerHeight="3rem"
              name="year"
              onChange={(e) => setYear(e.target.value)}
              value={year}
              options={[
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
              ]}
            />
          </div>
          <div className="items-center">
            <BarChart
              data={dataset}
              height="h-72"
              years={months}
              values={values}
            />
          </div>
        </Card> */}
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Kondisi Aset
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <DonutChart
              data={dataset}
              height="h-72"
              good={condAsset[1]?.value ?? 0}
              mid={condAsset[2]?.value ?? 0}
              damage={condAsset[3]?.value ?? 0}
            />
            <div className="grid grid-cols-2 ">
              {condAsset.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span className="text">{item.title}</span>
                  </div>
                  <span
                    className={
                      item.title === "Nilai Aset"
                        ? `text-2xl font-semibold `
                        : `text-3xl font-semibold `
                    }
                  >
                    {item.title === "Nilai Aset"
                      ? formatCurrency(item.value)
                      : formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="flex flex-col col-span-2">
          <span className="text-xl font-bold color-[#B7B7B7] mb-4">
            Rincian Kondisi Aset per Eselon 1
          </span>
          <TableStateProperty dataTable={assetEs1} />
        </Card>
      </div>
    </div>
  );
}

export default StateProperty;
