import React, { useContext, useEffect, useState } from "react";
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
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";

function BudgetExecution() {
  const { userData } = useContext(AppContext);
  const [cardsData, setCardsData] = useState([]);
  const [es1Data, setEs1Data] = useState({ columns: [], data: [] });
  const mapColorByIKPA = (ikpa) => {
    if (ikpa >= 95) return "bg-[#6FCE00]"; // Sangat Baik
    if (ikpa >= 89) return "bg-[#2E70FD]"; // Baik
    if (ikpa >= 70) return "bg-[#ECFD2E]"; // Cukup
    return "bg-[#FF4155]"; // Kurang
  };

  const es1Options = async () => {
    try {
      const data = await apiRequest({
        url: `/api/pa/ikpa/all`,
      });
      let mapped = data?.data
        .filter((q) => q.satker_code === null)
        .map((item, index) => {
          const constantItem = dataTable.data[index];

          return {
            eselon: constantItem?.eselon || item.name, // fallback ke item.name kalau tidak ketemu
            revisiDipa: item.revisi_dipa,
            deviasiHalIII: item.deviasi_hal3_dipa,
            realisasiAnggaran: item.realisasi_anggaran,
            belanjaKontraktual: item.belanja_kontraktual,
            penyelesaianTagihan: item.penyelesaian_tagihan,
            pengelolaanUPTUP: item.pengelolaan_up_tup,
            capaianOutput: item.capaian_output,
            dispensasiSPM: item.dispensasi_spm,
            nilaiIKPA: item.nilai_ikpa,
          };
        });

      setEs1Data({
        columns: dataTable.columns,
        data: mapped,
      });

      let mappedCards = mapped
        .filter((q) => q.eselon !== "Kementerian Ketenagakerjaan")
        .map((item) => ({
          title: item.eselon,
          value: item.nilaiIKPA.toFixed(2),
          color: mapColorByIKPA(item.nilaiIKPA),
        }));
      setCardsData(mappedCards);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    es1Options();
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Pelaksanaan Anggaran", path: "/pelaksanaan-anggaran" },
          ]}
        />
        <User
          name={userData?.name}
          previlege={userData?.role?.toUpperCase()}
          username={userData?.biro_code}
          role={userData?.role}
          access_code={userData?.access_code}
          id={userData?.id}
        />
      </div>
      <Title>Dashboard Pelaksanaan Anggaran</Title>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Card className="row-span-2">
          <div className="flex flex-col items-center ">
            <span className="font-bold text-2xl text-center">NILAI IKPA</span>
            <IKPAChart height={"h-48"} val={es1Data?.data?.[0]?.nilaiIKPA} />
            <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center px-6 pb-1 absolute top-[22rem]">
              <span className="font-bold text-sm text-center text-white ">
                Bulan{" "}
                {moment().locale("id").subtract(1, "months").format("MMMM")}
              </span>
            </div>
            <span className="font-bold text-sm text-center">
              Kementerian Ketenagakerjaan
            </span>
          </div>
        </Card>
        {cardsData.map((item, index) => (
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
              {"Nilai IKPA ≥ 90"}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Sangat Baik</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#2E70FD]"></div>
            <span className="text-sm">{"89 ≤ Nilai IKPA < 95"}</span>
            <span className="text-sm">:</span>
            <span className="text-sm">Baik</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#ECFD2E]"></div>
            <span className="text-sm">{"70 ≤ Nilai IKPA < 89"}</span>
            <span className="text-sm">:</span>
            <span className="text-sm">Cukup</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#FF4155]"></div>
            <span className="text-sm">
              {"Nilai IKPA < 70"}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-sm">:</span>
            <span className="text-sm">Kurang</span>
          </div>
        </div>
      </div>
      <TableBudgetExecution dataTable={es1Data} />
    </div>
  );
}

export default BudgetExecution;
