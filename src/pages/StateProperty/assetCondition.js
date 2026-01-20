import React, { useContext } from "react";
import Card from "@/components/Card";
import DonutChart from "./DonutChart";
import User from "@/components/User";
import Title from "@/components/Title";
import { Leaf, PieChart, List, Menu } from "lucide-react";
import { formatCurrency, formatNumber } from "@/services/GeneralHelper";
import { AppContext } from "@/contexts/AppContext";

function KondisiAset() {
  const { setMobileMenuOpen } = useContext(AppContext);

  // ---DATA DUMMY ---
  const kondisiData = {
    total: 520072,
    baik: 336300,
    rusakRingan: 193826,
    rusakBerat: 193826,
    nilaiAset: 16920388457705,
  };

  const nilaiKondisiData = {
    baik: 15831069013295,
    rusakRingan: 44958013451,
    rusakBerat: 20097635354,
  };

  const tableData = [
    {
      name: "Sekretariat Jenderal",
      sudah: 27590,
      belum: 732,
      total: 34722,
      percent: 88,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Inspektorat Jenderal",
      sudah: 1289,
      belum: 0,
      total: 1289,
      percent: 100,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Ditjen Binapenta",
      sudah: 23221,
      belum: 16988,
      total: 40198,
      percent: 63.2,
      color: "bg-orange-100 text-orange-500",
    },
    {
      name: "PHI dan Jamsostek",
      sudah: 10403,
      belum: 8402,
      total: 18805,
      percent: 55,
      color: "bg-pink-100 text-pink-500",
    },
  ];

  // --- CONFIG CHART ---
  const chartKondisiData = [
    {
      value: kondisiData.baik,
      name: "Kondisi Baik",
      itemStyle: { color: "#C0D756" },
    },
    {
      value: kondisiData.rusakRingan,
      name: "Rusak Ringan",
      itemStyle: { color: "#FFB300" },
    },
    {
      value: kondisiData.rusakBerat,
      name: "Rusak Berat",
      itemStyle: { color: "#F50057" },
    },
  ];

  // --- HELPER COMPONENTS ---
  const CardIcon = ({ icon: Icon, colorClass, bgClass }) => (
    <div
      className={`absolute -top-5 left-6 w-10 h-10 rounded-full flex items-center justify-center ${bgClass} shadow-sm border border-white`}
    >
      <Icon size={20} className={colorClass} />
    </div>
  );

  const LegendItem = ({ color, label, value, isCurrency = false }) => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-gray-600 text-sm font-medium">{label}</span>
      </div>
      <span className="text-xl font-bold text-gray-900 ml-5 break-all">
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </span>
    </div>
  );

  return (
    <div>
      <div className="bg-gray-50 max-h-screen font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-4">
          {/* CARD  KONDISI ASET */}
          <Card className="rounded-[2rem] bg-white max-h-[430px] shadow-sm border border-gray-100 relative overflow-visible">
            <CardIcon
              icon={Leaf}
              bgClass="bg-green-50"
              colorClass="text-[#C0D756]"
            />

            <h3 className="text-lg font-bold text-gray-900">
              Kondisi Aset
            </h3>

            <div className="flex flex-col  items-center justify-center h-full flex-1">
              <div className="w-[180px] h-[180px] shrink-0">
                <DonutChart
                  data={chartKondisiData}
                  height="h-full"
                  radius={["55%", "85%"]}
                />
              </div>

              <div className="flex flex-col w-full md:w-auto">
                <div className="grid grid-cols-2 gap-x-6 ">
                  <LegendItem
                    color="#40C4FF"
                    label="Total Aset"
                    value={kondisiData.total}
                  />
                  <LegendItem
                    color="#C0D756"
                    label="Kondisi Baik"
                    value={kondisiData.baik}
                  />
                  <LegendItem
                    color="#FFB300"
                    label="Rusak Ringan"
                    value={kondisiData.rusakRingan}
                  />
                  <LegendItem
                    color="#F50057"
                    label="Rusak berat"
                    value={kondisiData.rusakBerat}
                  />
                </div>
                <div className="mt-2">
                  <LegendItem
                    color="#8E8E93"
                    label="Nilai Aset"
                    value={kondisiData.nilaiAset}
                    isCurrency={true}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* CARD  NILAI ASET */}
          <Card className=" rounded-[2rem] bg-white max-h-[430px] shadow-sm border border-gray-100 relative overflow-visible">
            <CardIcon
              icon={PieChart}
              bgClass="bg-pink-50"
              colorClass="text-pink-500"
            />

            <h3 className="text-lg font-bold text-gray-900 ">
              Nilai Aset Berdasarkan Kondisi
            </h3>

            <div className="flex flex-col  items-center justify-center ">
              <div className="w-[180px] h-[180px] shrink-0">
                <DonutChart
                  data={chartKondisiData}
                  height="h-full"
                  radius={["55%", "85%"]}
                />
              </div>

              <div className="flex flex-col w-full md:w-auto">
                <LegendItem
                  color="#C0D756"
                  label="Kondisi Baik"
                  value={nilaiKondisiData.baik}
                  isCurrency={true}
                />
                <LegendItem
                  color="#FFB300"
                  label="Rusak Ringan"
                  value={nilaiKondisiData.rusakRingan}
                  isCurrency={true}
                />
                <LegendItem
                  color="#F50057"
                  label="Rusak Berat"
                  value={nilaiKondisiData.rusakBerat}
                  isCurrency={true}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* CARD TABLE RINCIAN */}
        <Card className=" rounded-[2rem] bg-white shadow-sm border border-gray-100 relative  overflow-visible">
          <CardIcon
            icon={List}
            bgClass="bg-yellow-50"
            colorClass="text-yellow-500"
          />

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Rincian Kondisi Aset per Eselon 1
          </h3>

          <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead className="text-white bg-blue-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-4 py-3 text-left first:rounded-l-lg">
                    Eselon 1
                  </th>
                  <th className="px-4 py-3 text-center">Sudah PSP</th>
                  <th className="px-4 py-3 text-center">Belum PSP</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center last:rounded-r-lg">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-gray-600 font-medium">
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {formatNumber(row.sudah)}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {formatNumber(row.belum)}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500 font-semibold">
                      {formatNumber(row.total)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.color}`}
                      >
                        {row.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default KondisiAset;
