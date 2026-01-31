import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import moment from "moment";
import "moment/locale/id";
import { labelsDummy, dataTable } from "./constants";
import { apiRequest } from "@/services/APIHelper";
import BarChart from "./BarChart";
import { SquareKanban, Star } from "lucide-react";

function BudgetExecution() {
  const [cardsData, setCardsData] = useState([]);
  const year = moment().format("YYYY");
  const [es1Data, setEs1Data] = useState({ columns: [], data: [] });
  const mapColorByIKPA = (ikpa) => {
    if (ikpa >= 95) return "bg-green-bg"; // Sangat Baik
    if (ikpa >= 89) return "bg-blue-bg"; // Baik
    if (ikpa >= 79) return "bg-orange-bg"; // Cukup
    return "bg-red-bg"; // Kurang
  };

  const mapColorTextByIKPA = (ikpa) => {
    if (ikpa >= 95) return "text-green-text"; // Sangat Baik
    if (ikpa >= 89) return "text-blue-text"; // Baik
    if (ikpa >= 79) return "text-orange-text"; // Cukup
    return "text-red-text"; // Kurang
  };

  const dummyCard = [
    { title: "Sekertariat Jenderal", value: 88.23 },
    { title: "Inspektorat Jenderal", value: 95.29 },
    { title: "Ditjen Binapenta dan PKK", value: 94.2 },
    { title: "PHI & Jamsostek", value: 72.88 },
    { title: "Binwasnaker & K3", value: 95.29 },
    { title: "Barenbang Ketenagakerjaan", value: 95.29 },
    { title: "Binalavotas", value: 97.08 },
  ];

  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];
  const [values, setValues] = useState([
    70.7, 33.39, 50.48, 9.41, 83.77, 33.1, 31.96, 29.94,
  ]);

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
  const eselons = es1Data?.data?.map((item) => item.eselon);
  useEffect(() => {
    es1Options();
  }, [year]);

  return (
    <div>
      <div className="grid grid-cols-5 gap-x-4 gap-y-0 mb-4 bg-[#F1FAFF] rounded-lg justify-between">
        <div className="row-span-2 z-0">
          <div className="lg:row-span-2 relative bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] text-white rounded-xl px-7 py-10 flex flex-col gap-12 overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <span className="font-bold text-lg md:text-xl lg:text-2xl">
                Nilai IKPA
              </span>
              <span className="font-medium  text-xs md:text-sm opacity-90">
                {moment().locale("id").format("MMMM YYYY")}
              </span>
            </div>
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold my-4 z-10">
              94.91
            </span>
            <span className="font-semibold text-sm md:text-baseleading-tight z-10">
              Kementerian
              <br />
              Ketenagakerjaan
            </span>
            <img
              src={"/kemnaker-logo-decoration-gradient.webp"}
              alt={"decor-1"}
              className={`absolute right-[-5rem] bottom-[-4.5rem] rotate-[165.25deg] z-3`}
              loading="eager"
              width={250}
            />
            <img
              src={"/kemnaker-logo-decoration-gradient.webp"}
              alt={"decor-1"}
              className={`absolute left-[-5rem] top-[-4.5rem] rotate-[-186.75deg] z-3`}
              loading="eager"
              width={250}
            />
          </div>
        </div>
        {dummyCard &&
          dummyCard.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl py-2 px-3 flex flex-col my-4 ml-[-3rem] mr-[3rem] z-10`}
            >
              <div className="mb-2">
                <span
                  className={` inline-block text-xs md:text-sm font-semibold px-2 py-1 rounded ${mapColorTextByIKPA(item?.value)} ${mapColorByIKPA(item?.value)}
        `}
                >
                  {item.title}
                </span>
              </div>
              <span className="text-4xl md:text-5xl lg:text-6xl font-black leading-none py-4">
                {item.value}
              </span>
            </div>
          ))}

        <div className="lg:row-span-2 lg:col-span-1 rounded-xl py-1 px-2 w-full h-fit ml-[-3rem]">
          <div className="flex flex-col flex-1 justify-center gap-1">
            <span className="font-bold text-sm md:text-base">
              Indikator Warna
            </span>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#6FCE00] rounded-sm flex-shrink-0"></div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="font-medium whitespace-nowrap">
                  Nilai IKPA ≥ 95
                </span>
                <span>:</span>
                <span className="font-semibold">Sangat Baik</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#2E70FD] rounded-sm flex-shrink-0"></div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="font-medium whitespace-nowrap">
                  89 ≤ Nilai IKPA &lt; 95
                </span>
                <span>:</span>
                <span className="font-semibold">Baik</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#ECFD2E] rounded-sm flex-shrink-0"></div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="font-medium whitespace-nowrap">
                  70 ≤ Nilai IKPA &lt; 89
                </span>
                <span>:</span>
                <span className="font-semibold">Cukup</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#FF4155] rounded-sm flex-shrink-0"></div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="font-medium whitespace-nowrap">
                  Nilai IKPA &lt; 70
                </span>
                <span>:</span>
                <span className="font-semibold">Kurang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-4">
        <Card
          className="min-h-[400px]"
          icon={<SquareKanban size={26} color="#D5F1FF" strokeWidth={2} />}
          color="bg-[#59C7FF]"
          title="Persentase Realisasi Anggaran per Eselon 1"
        >
          <div className="items-center">
            <BarChart
              data={dataset}
              height="h-72 "
              // labels={eselons}
              labels={labelsDummy}
              values={values}
            />
          </div>
        </Card>
        <Card
          className="min-h-[400px]"
          icon={
            <Star size={26} fill="#FFF3D0" color="#FFF3D0" strokeWidth={2} />
          }
          color="bg-[#FFBE02]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-[3rem] bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] flex items-center justify-center shadow">
                <span className="text-white text-6xl md:text-7xl lg:text-[8rem] font-bold">
                  9
                </span>
              </div>
              <br></br>
              <span className="font-semibold  text-center mb-2 text-base md:text-lg lg:text-xl">
                Peringkat Realisasi <br /> Kemnaker
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-[3rem] bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] flex items-center justify-center shadow-md">
                <span className="text-white text-6xl md:text-7xl lg:text-[8rem] font-bold">
                  16
                </span>
              </div>
              <br></br>
              <span className="font-semibold  text-center mb-2 text-base md:text-lg lg:text-xl">
                Peringkat Alokasi <br /> Seluruh Kementerian
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BudgetExecution;
