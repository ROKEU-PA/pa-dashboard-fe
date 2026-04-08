import React from "react";
import Card from "@/components/Card";
import DonutChart from "./DonutChart";
import { Leaf, Database, BarChart3, PieChart } from "lucide-react";
import { formatCurrency, formatNumber } from "@/services/GeneralHelper";
import { useFetchBMN } from "./hooks/useFetchBMN";
import { formatToAssetPieChart } from "./hooks/useFormatChart";

function StateProperty() {
  const { dataAsset, dataGrant, dataType } = useFetchBMN();

  const dataStatus = { total: 520072, sudah: 336300, belum: 193826 };

  const dataHibah = { sk: 1.98, belum: 18, batal: 511 };

  const chartStatusData = [
    {
      value: dataStatus.sudah,
      name: "Sudah PSP",
      itemStyle: { color: "#C0D756" },
    },
    {
      value: dataStatus.belum,
      name: "Belum PSP",
      itemStyle: { color: "#8E8E93" },
    },
  ];

  const CardIcon = ({ icon: Icon, bgClass, colorClass }) => (
    <div
      className={`absolute -top-4 left-6 w-10 h-10 rounded-full flex items-center justify-center ${bgClass} shadow-sm border-2 border-white z-10`}
    >
      <Icon size={18} className={colorClass} />
    </div>
  );

  const LegendItem = ({
    color,
    label,
    value,
    isCurrency = false,
    isTriliun = false,
    isJuta = false,
  }) => (
    <div className="flex flex-col mb-1">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-xl font-bold text-gray-800 ml-4.5">
        {isTriliun
          ? `Rp ${value} Triliun`
          : isJuta
            ? `Rp ${value} Juta`
            : isCurrency
              ? formatCurrency(value)
              : formatNumber(value)}
      </span>
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] h-[830] w-full flex flex-col p-2 md:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  items-stretch">
        <Card className="rounded-3xl bg-white h-[440px] shadow-sm relative border-none flex flex-col">
          <CardIcon
            icon={Leaf}
            bgClass="bg-[#E9F5DB]"
            colorClass="text-[#A3C546]"
          />
          <h3 className="text-lg font-bold text-gray-800">
            Status Penetapan Status Penggunaan
          </h3>
          <div className="flex flex-col items-center w-full">
            <DonutChart data={chartStatusData} />

            <div className="flex justify-center w-full">
              <div className="grid grid-cols-2 gap-x-12 ">
                <LegendItem
                  color="#4FC3F7"
                  label="Total Aset"
                  value={dataStatus.total}
                />
                <LegendItem
                  color="#C0D756"
                  label="Sudah PSP"
                  value={dataStatus.sudah}
                />
                <LegendItem
                  color="#8E8E93"
                  label="Belum PSP"
                  value={dataStatus.belum}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl bg-white shadow-sm h-[440px] relative border-none flex flex-col">
          <CardIcon
            icon={Database}
            bgClass="bg-[#E3F2FD]"
            colorClass="text-[#2196F3]"
          />
          <h3 className="text-lg font-bold text-gray-800 ">Kondisi Aset</h3>
          <div className="flex flex-col items-center w-full">
            <DonutChart data={dataAsset && formatToAssetPieChart(dataAsset)} />

            <div className="flex justify-center w-full">
              <div className="grid grid-cols-2 gap-x-12 ">
                <LegendItem
                  color="#4FC3F7"
                  label="Total Aset"
                  value={dataAsset && dataAsset?.[0].value}
                />
                <LegendItem
                  color="#C0D756"
                  label="Kondisi Baik"
                  value={dataAsset && dataAsset?.[2].value}
                />
                <LegendItem
                  color="#FFB300"
                  label="Rusak Ringan"
                  value={dataAsset && dataAsset?.[3].value}
                />
                <LegendItem
                  color="#F50057"
                  label="Rusak berat"
                  value={dataAsset && dataAsset?.[4].value}
                />
                <div className="col-span-2 mt-1">
                  <LegendItem
                    color="#8E8E93"
                    label="Nilai Aset"
                    value={dataAsset && dataAsset?.[1].value}
                    isCurrency
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl bg-white shadow-sm h-[400px] relative border-none flex flex-col p-6">
          <CardIcon
            icon={BarChart3}
            bgClass="bg-[#F1F8E9]"
            colorClass="text-[#7CB342]"
          />

          <div className="flex flex-col mb-3 gap-3">
            <h3 className="text-lg font-bold text-gray-800">
              Total Nilai Hibah 526
            </h3>
            <div className="text-center justify-center">
              <p className="text-xl font-medium uppercase tracking-wider">
                Total Hibah :Rp 21.89 Triliun
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-[2%] w-full h-full min-h-[200px] px-1">
            {[40, 60, 95, 70, 55, 80, 90, 100].map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-1 h-full justify-end group"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-all bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded mb-1 whitespace-nowrap">
                  {h}T
                </div>
                <div
                  style={{ height: `${h}%` }}
                  className="bg-[#4FC3F7] w-full max-w-[40px] rounded-t-md md:rounded-t-lg transition-all duration-300 ease-in-out group-hover:bg-[#03A9F4] shadow-sm relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
                <span className="text-[10px] md:text-[11px] text-gray-400 mt-3 font-bold">
                  {2018 + i}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-3xl bg-white shadow-sm h-[400px] relative border-none flex flex-col">
          <CardIcon
            icon={PieChart}
            bgClass="bg-[#FFF3E0]"
            colorClass="text-[#FB8C00]"
          />
          <h3 className="text-lg font-bold text-gray-800">
            Progress Hibah 526
          </h3>
          <div className="flex flex-col items-center w-full">
            <DonutChart data={chartStatusData} />

            <div className="flex justify-center w-full">
              <div className="grid grid-cols-2 gap-x-12 ">
                <LegendItem
                  color="#8E8E93"
                  label="Total SK Hibah"
                  value={dataHibah.sk}
                  isTriliun
                />
                <LegendItem
                  color="#C0D756"
                  label="Belum Persetujuan"
                  value={dataHibah.belum}
                  isJuta
                />
                <div className="flex flex-col ">
                  <div className="flex items-center ">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <span className="text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                      Batal Hibah
                    </span>
                  </div>
                  <span className="text-[15px] font-bold text-gray-800 ml-4.5">
                    Rp 511 Juta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StateProperty;
