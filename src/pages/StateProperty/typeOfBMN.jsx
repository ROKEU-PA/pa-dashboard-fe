import React, { useContext } from "react";
import User from "@/components/User";
import { Menu } from "lucide-react";
import Title from "@/components/Title";
import { AppContext } from "@/contexts/AppContext";
import { formatNumber } from "@/services/GeneralHelper";

function JumlahJenisBMN() {
  const { setMobileMenuOpen } = useContext(AppContext);
  const eselonData = [
    { name: "Sekretariat Jenderal", value: 34722 },
    { name: "Inspektorat Jenderal", value: 1289 },
    { name: "Ditjen Binapenta", value: 40198 },
    { name: "PHI dan Jamsostek", value: 19805 },
    { name: "Binwasnaker dan K3", value: 19805 },
    { name: "Barenbang", value: 19805 },
    { name: "Binalavotas", value: 19805 },
  ];

  // JENIS BMN
  const jenisBMNList = [
    "Alat Angkutan Bermotor",
    "Alat Angkutan Tidak Bermotor",
    "Alat Berat",
    "Aset tak Berwujud",
    "Aset Tetap Lainnya",
    "Aset Tetap Renovasi",
    "Bangunan Air",
    "Bangunan dan Gedung",
    "Instalasi dan Jaringan",
    "Jalan dan Jembatan",
    "KDP",
    "Mesin Peralatan Khusus TIK",
    "Mesin Peralatan non TIK",
    "Rumah Negara",
    "Tanah",
  ];

  //  KARTU KECIL
  const MiniTableCard = ({ title, data }) => (
    <div className="bg-sky-400 rounded-2xl pt-[20px] overflow-hidden ">
      <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200">
        <div className="p-4 pb-2 pt-2 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            Jenis BMN : {title}
          </h3>
        </div>
        <div className="p-3">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="bg-blue-500 text-white font-bold">
                <tr>
                  <th className="px-4 py-2">Eselon 1</th>
                  <th className="px-4 py-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-800 font-bold">
                      {formatNumber(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-gray-50 min-h-screen font-sans  md:p-2">
        <div className="w-full bg-[#40C4FF] text-white font-bold text-center py-3 rounded-lg shadow-sm mb-3 text-lg">
          Jumlah Jenis BMN per Eselon 1
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
          {jenisBMNList.map((jenis, index) => (
            <MiniTableCard key={index} title={jenis} data={eselonData} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default JumlahJenisBMN;
