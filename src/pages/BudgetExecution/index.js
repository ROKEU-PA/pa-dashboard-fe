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
import Select from "@/components/Select";
import BarChart from "./BarChart";

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

  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];
  const [values, setValues] = useState([70.70, 33.39, 50.48, 9.41, 83.77, 33.10, 31.96, 29.94]);
  const [selectOpen, setSelectOpen] = useState(false);
  const [year, setYear] = useState("2025");

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
            eselon: constantItem?.eselon || item.name,
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
  // const realGraph = async () => {
  //   try {
  //     const data = await apiRequest({
  //       url: `/api/bmn/pnbp?tahun=` + year,
  //     });
  //     setMonth(
  //       data?.data?.years.length === 0
  //         ? [
  //             "Jan",
  //             "Feb",
  //             "Mar",
  //             "Apr",
  //             "May",
  //             "Jun",
  //             "Jul",
  //             "Aug",
  //             "Sep",
  //             "Oct",
  //             "Nov",
  //             "Dec",
  //           ]
  //         : data?.data?.years
  //     );
  //     setValues(
  //       data?.data?.values.length === 0
  //         ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //         : data?.data?.values.map((v) => Number(v))
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const eselons = es1Data.data.map((item) => item.eselon);
  useEffect(() => {
    es1Options();
    // realGraph();
  }, [year]);
  return (
    <div>
      <div className="flex sm:flex-row justify-between">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <Card className="row-span-2">
          <div className="flex flex-col items-center ">
            <span className="font-bold text-2xl text-center">NILAI IKPA</span>
            <IKPAChart height={"h-48"} val={es1Data?.data?.[0]?.nilaiIKPA} />
            <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-2xl text-center px-4 py-1 mt-2">
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
                <span className="font-bold text-sm sm:text-base">
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
          <span className="font-bold">Ketentuan Penilaian</span>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#6FCE00]"></div>
            <span className="text-sm">
              {"Nilai IKPA ≥ 95"}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-4">
        <Card className="">
          <div className="grid grid-cols-[90%_10%] items-center mb-4">
            <span className="font-bold text-lg block mb-4">
              Persentase Realisasi Anggaran per Eselon 1
            </span>
          </div>
          <div className="items-center">
            <BarChart
              data={dataset}
              height="h-72 "
              labels={eselons}
              values={values}
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peringkat Realisasi Kemnaker */}
            <div className="flex flex-col items-center">
              <span className="font-semibold text-center mb-2 text-xl">
                Peringkat Realisasi <br /> Kemnaker
              </span>
              <br></br>
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 flex items-center justify-center shadow">
                <span className="text-white text-6xl sm:text-7xl md:text-8xl font-bold">9</span>
              </div>
            </div>

            {/* Peringkat Alokasi */}
            <div className="flex flex-col items-center">
              <span className="font-semibold text-center mb-2 text-xl">
                Peringkat Alokasi <br /> Seluruh Kementerian
              </span>
              <br></br>
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-6xl sm:text-7xl md:text-8xl font-bold">16</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* <TableBudgetExecution dataTable={es1Data} /> */}
    </div>
  );
}

export default BudgetExecution;
