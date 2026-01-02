import React from "react";
import Title from "@/components/Title";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import { formatCurrency } from "@/services/GeneralHelper";
import User from "@/components/User";
import {
  AssetConditions,
  datasetBarChart,
  datasetKehadiran,
  datasetPegawai,
  datasetPendidikan,
} from "./constants";
import Select from "@/components/Select";
import moment from "moment";

function Administrator() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Breadcrumbs
          items={[
            { name: "Barang Milik Negara", path: "/barang-milik-negara" },
          ]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Barang Milik Negara</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="items-center mb-4">
            <span className="font-bold text-xl">Jumlah Pegawai</span>
          </div>
          <div className="grid grid-cols-1 grid-cols-2">
            <div className="items-center">
              <DonutChart dataset={datasetPegawai} height="h-40" />
            </div>
            <div className="grid grid-cols-3">
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <span className="text-xl">Pria</span>
                </div>
                <span className={`text-4xl font-semibold`}>17</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <span className="text-xl">Wanita</span>
                </div>
                <span className={`text-4xl font-semibold`}>38</span>
              </div>
              <div key="info" className={`flex flex-col col-span-3 `}>
                <div
                  className={`flex gap-2 items-center font-bold text-white bg-blue-500 rounded w-[60%] px-2`}
                >
                  <span className="text-xl">Jumlah Pegawai</span>
                </div>
                <span className={`text-4xl font-semibold`}>55</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="items-center mb-4">
            <span className="font-bold text-xl">Pendidikan Pegawai</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="items-center">
              <DonutChart dataset={datasetPendidikan} height="h-40" />
            </div>
            <div className="grid grid-cols-2 items-right float-end">
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-base">Pendidikan Diploma</span>
                </div>
                <span className={`text-4xl font-semibold`}>13</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <div className="w-3 h-3 bg-[#616484] rounded-full"></div>
                  <span className="text-base">Pendidikan S1</span>
                </div>
                <span className={`text-4xl font-semibold`}>32</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-base">Pendidikan S2</span>
                </div>
                <span className={`text-4xl font-semibold`}>3</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-base">Pendidikan S3</span>
                </div>
                <span className={`text-4xl font-semibold`}>0</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-xl">
              Rekap Kehadiran dalam 1 Bulan{" "}
            </span>
            <span className="text-xl text-gray-500">
              Bulan {moment().locale("id").format("MMMM")}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <div className="items-center">
              <DonutChart dataset={datasetKehadiran} height="h-64" />
            </div>
            <div className="grid grid-cols-2 items-right float-end">
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-base">Kehadiran</span>
                </div>
                <span className={`text-4xl font-semibold`}>50</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold`}>
                  <div className="w-3 h-3 bg-[#616484] rounded-full"></div>
                  <span className="text-base">Terlambat</span>
                </div>
                <span className={`text-4xl font-semibold`}>43</span>
              </div>
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-base">Tidak Hadir</span>
                </div>
                <span className={`text-4xl font-semibold`}>3</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="grid grid-cols-2">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl">
                IKK Indeks Pengelolaan Aset
              </span>
            </div>
            <div className="items-center flex gap-3">
              <BarChart dataset={datasetBarChart?.IKK_IPA} height="h-64" />
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-blue-500 "></div>
                  <span className="text-sm">Target IPA</span>
                </div>

                <span className={`text-4xl font-semibold`}>3.20</span>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-gray-400 "></div>
                  <span className="text-sm">Realisasi IPA</span>
                </div>
                <span className={`text-4xl font-semibold`}>3.59</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl">IKK IKPA</span>
            </div>

            <div className="items-center flex gap-4">
              <BarChart dataset={datasetBarChart?.IKK_IKPA} height="h-64" />
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-blue-500 "></div>
                  <span className="text-sm">Target IKPA</span>
                </div>

                <span className={`text-4xl font-semibold`}>93.50</span>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-gray-400 "></div>
                  <span className="text-sm">Realisasi IKPA</span>
                </div>
                <span className={`text-4xl font-semibold`}>94.99</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="grid grid-cols-2">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl">IKK Tindak Lanjut LK</span>
            </div>
            <div className="items-center flex gap-4">
              <BarChart dataset={datasetBarChart?.IKK} height="h-64" />
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-blue-500 "></div>
                  <span className="text-sm">Target</span>
                </div>

                <span className={`text-4xl font-semibold`}>70.55%</span>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-gray-400 "></div>
                  <span className="text-sm">Realisasi</span>
                </div>
                <span className={`text-4xl font-semibold`}>69.36%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl">
                IKK Tingkat Maturitas SPIP
              </span>
            </div>

            <div className="items-center flex gap-4">
              <BarChart dataset={datasetBarChart?.IKK_SPIP} height="h-64" />
              <div key="info" className={`flex flex-col`}>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-blue-500 "></div>
                  <span className="text-sm">Target</span>
                </div>
                <span className={`text-4xl font-semibold`}>70.55</span>

                <span className={`text-4xl font-semibold`}>3.93</span>
                <div className={`flex gap-2 items-center font-bold `}>
                  <div className="w-3 h-3 bg-gray-400 "></div>
                  <span className="text-sm">Realisasi</span>
                </div>
                <span className={`text-4xl font-semibold`}>3.93</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Administrator;
