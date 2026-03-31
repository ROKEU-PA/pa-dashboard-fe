import React from "react";
import { Users, GraduationCap, ChartColumn, Activity } from "lucide-react";
import moment from "moment";
import Card from "@/components/Card";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";

// Cukup import satu sumber data utama
import { DASHBOARD_DATA } from "./constants";

// --- Komponen Helper ---

function LegendItem({ color, label, value }) {
  return (
    <div className="text-center flex-1">
      <div className="flex flex-col md:flex-row items-center gap-1 justify-center mb-1">
        <span
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${color} block`}
        ></span>
        <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">
          {label}
        </span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-gray-900">
        {value}
      </span>
    </div>
  );
}

function IKKCard({ title, dataset }) {
  // Ambil nilai  dari dataset constants.jsx
  const targetValue = dataset.values[0];
  const realisasiValue = dataset.values[1];

  return (
    <Card className="h-[400px] m-2 border-none bg-white flex flex-col p-2">
      <h4 className="font-bold text-gray-900 text-sm h-10 leading-tight">
        {title}
      </h4>
      <div className="flex-1 flex items-end justify-center">
        <BarChart dataset={dataset} height="h-64" />
      </div>
      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              Target
            </span>
          </div>
          <span className="block text-lg font-bold text-gray-700">
            {targetValue}
          </span>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              Realisasi
            </span>
            <div className="w-2 h-2 rounded-full bg-[#5CC2F6]"></div>
          </div>
          <span className="block text-lg font-bold text-gray-700">
            {realisasiValue}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Administrator() {
  const { pegawai, pendidikan, kehadiran, gaji, ikk } = DASHBOARD_DATA;

  return (
    <div className="min-h-screen p-2 bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* Donut Charts Pegawai & Pendidikan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="relative h-[400px] rounded-[2rem] shadow-sm border-none bg-white ">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-white shadow-sm">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 ">Jumlah Pegawai</h3>

            <DonutChart
              dataset={pegawai}
              colors={["#C1D857", "#8F9298"]}
              height="h-60"
            />

            <div className="flex flex-row justify-between w-full px-4 mt-6">
              <LegendItem color="bg-blue-400" label="Total" value="48" />
              <LegendItem
                color="bg-[#C1D857]"
                label="Pria"
                value={pegawai[0].value}
              />
              <LegendItem
                color="bg-[#8F9298]"
                label="Wanita"
                value={pegawai[1].value}
              />
            </div>
          </Card>

          <Card className="relative h-[400px] rounded-[2rem] shadow-sm border-none bg-white p-6">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-white shadow-sm">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 ">
              Pendidikan Pegawai
            </h3>
            <DonutChart
              dataset={pendidikan}
              colors={["#C1D857", "#5CC2F6", "#8F9298", "#E5E7EB"]}
              height="h-60"
            />
            <div className="flex flex-row justify-between w-full px-4 mt-6">
              <LegendItem
                color="bg-[#C1D857]"
                label="Diploma"
                value={pendidikan[0].value}
              />
              <LegendItem
                color="bg-[#5CC2F6]"
                label="Sarjana"
                value={pendidikan[1].value}
              />
              <LegendItem
                color="bg-[#8F9298]"
                label="Magister"
                value={pendidikan[2].value}
              />
            </div>
          </Card>
        </div>

        {/* Kehadiran & Gaji */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
          <Card className="relative h-[410px] rounded-[2rem] shadow-sm border-none bg-white p-6">
            <div className="flex justify-between items-center ">
              <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 border border-white shadow-sm">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg text-gray-900">
                Rekap Kehadiran Bulanan
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase">
                {moment().format("MMMM YYYY")}
              </span>
            </div>

            <DonutChart
              dataset={kehadiran}
              colors={["#C1D857", "#5CC2F6", "#8F9298"]}
              height="h-60"
            />
            <div className="flex flex-row justify-between w-full px-4 mt-4">
              <LegendItem
                color="bg-[#C1D857]"
                label="Hadir"
                value={kehadiran[0].value}
              />
              <LegendItem
                color="bg-[#5CC2F6]"
                label="Alfa"
                value={kehadiran[1].value}
              />
              <LegendItem
                color="bg-[#8F9298]"
                label="Telat"
                value={kehadiran[2].value}
              />
            </div>
          </Card>

          <Card className="relative h-[410px] p-6 rounded-[2rem] shadow-sm border-none bg-white">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500  border border-white shadow-sm">
              <ChartColumn size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">
              Kenaikan Gaji Berkala
            </h3>
            <div className="w-full pt-4">
              {/* Mengambil data gaji dari DASHBOARD_DATA */}
              <BarChart dataset={gaji} height="h-72" isGajiChart={true} />
            </div>
          </Card>
        </div>

        {/*  IKK Section (Mengambil dari objek ikk) */}
        <div className="relative p-6 rounded-[2rem] shadow-sm border-none bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-white shadow-sm">
            <Activity size={18} />
          </div>

          <IKKCard
            title="IKK Tindak Lanjut LK"
            target="70.55"
            realisasi="69.88"
            dataset={ikk.tindakLanjut}
          />
          <IKKCard
            title="IKK Tingkat Maturitas SPIP"
            target="3.81"
            realisasi="3.99"
            dataset={ikk.maturitas}
          />
          <IKKCard
            title="IKK Pengelolaan Aset"
            target="3.2"
            realisasi="4.4"
            dataset={ikk.aset}
          />
          <IKKCard
            title="IKK IKPA"
            target="91.2"
            realisasi="92.7"
            dataset={ikk.ikpa}
          />
        </div>
      </div>
    </div>
  );
}

export default Administrator;
