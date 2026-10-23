import Card from "@/components/Card";
import { Building2, Landmark, Leaf, SquareKanban } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import DonutChartAkuntansi from "./DonutChartAkuntansi";
import { formatCurrency } from "@/services/GeneralHelper";
import BarChartIPA from "./BarChartIPA";

function MainDashboard() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PTUK Card */}
        <Card
          className="min-h-[400px]"
          icon={<Leaf size={26} color="#6FCE00" strokeWidth={2} />}
          color="bg-neon-bg"
          title="PTUK"
          subCaption="Pengelola Keuangan"
        >
          <div className="flex flex-col gap-4">
            <DonutChart data={dataset} height="h-48" />
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="flex flex-col px-4 sm:px-8 min-w-0 ml-20">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-gray-400 rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">Jumlah Temuan</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  2072
                </span>
              </div>
              <div className="flex flex-col px-4 sm:px-8 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-blue-400 rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TL Status Belum Selesai</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  655
                </span>
              </div>
              <div className="flex flex-col px-4 sm:px-8 min-w-0 ml-20">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-yellow-400 rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TPTD</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  18
                </span>
              </div>
              <div className="flex flex-col px-4 sm:px-8 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-neon rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TL Status Sesuai</span>
                </div>
                <span className="text-4xl ml-4 font-extrabold leading-none">
                  1222
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pelaksanaan Anggaran Card */}
        <Card
          className="min-h-[400px]"
          icon={<Landmark size={26} color="#FC0166" strokeWidth={2} />}
          color="bg-pink-200"
          title="Pelaksanaan Anggaran"
          subCaption={`Nilai IKPA dan Target Tahun ${currentYear}`}
        >
          <div className="gap-2 items-center">
            <div className="min-w-0">
              <BarChart data={dataset} />
            </div>
            <div className="flex gap-2 flex-col pt-5 items-center">
              <div className="bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] rounded-2xl text-center px-4 py-2 w-fit ">
                <span className="text-6xl font-black text-white p-4">94</span>
              </div>
              <p className="font-bold text-xs text-center">
                Target Nilai IKPA Kemnaker 2025
              </p>
            </div>
          </div>
        </Card>

        {/* Barang Milik Negara Card */}
        <Card
          className="min-h-[400px]"
          icon={<Building2 size={26} color="#FFBC00" strokeWidth={2} />}
          color="bg-yellow-100"
          title="Barang Milik Negara"
          subCaption={`Nilai IPA dan Target Tahun ${currentYear}`}
        >
          <div className="items-center">
            <div className="flex gap-2 flex-col pt-5 items-center">
              <div className="bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] rounded-2xl text-center px-4 py-2 w-fit ">
                <span className="text-6xl font-black text-white p-4">3.2</span>
              </div>
              <p className="font-bold text-xs text-center">
                Target Nilai IKPA Kemnaker 2025
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center min-w-0">
              <BarChartIPA data={dataset} height="h-fit" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 bg-[#59C7FF]" />
                <span className="text-xs ">Nilai IPA 2025</span>
                <span className="text-lg font-bold">3.59</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Akuntansi dan Pelaporan Card */}
        <Card
          className="min-h-[400px]"
          icon={<SquareKanban size={26} color="#59C7FF" strokeWidth={2} />}
          color="bg-blue-100"
          title="Akuntansi dan Pelaporan"
          subCaption="Realisasi Anggaran"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-center">
                Realisasi Anggaran
              </span>
              <DonutChartAkuntansi data={dataset} height="h-40" />
              <div className="flex flex-col pl-[22%] pb-2 text-lg">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-neon rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">Realisasi</span>
                </div>
                <span className="ml-4 font-bold leading-none">
                  {formatCurrency(10504149944398)}
                </span>
              </div>
              <div className="flex flex-col pl-[22%] pb-2 text-lg">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-kemnaker-blue rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TPTD</span>
                </div>
                <span className="ml-4 font-bold leading-none">
                  {formatCurrency(10504149944398)}
                </span>
              </div>
              <div className="flex flex-col pl-[22%] pb-2 text-lg">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-red-600 rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">Blokir</span>
                </div>
                <span className="ml-4 font-bold leading-none">
                  {formatCurrency(10504149944398)}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-center">
                Realisasi Pendapatan
              </span>
              <DonutChartAkuntansi data={dataset} height="h-40" />
              <div className="flex flex-col pl-[22%] pb-2 text-lg">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-neon rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">Realisasi</span>
                </div>
                <span className="ml-4 font-bold leading-none">
                  {formatCurrency(10504149944398)}
                </span>
              </div>
              <div className="flex flex-col pl-[22%] pb-2 text-lg">
                <div className="flex gap-2 items-center mb-1">
                  <div
                    className={`w-3 h-3 bg-kemnaker-blue rounded-full flex-shrink-0`}
                  />
                  <span className="truncate">TPTD</span>
                </div>
                <span className="ml-4 font-bold leading-none">
                  {formatCurrency(10504149944398)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MainDashboard;
