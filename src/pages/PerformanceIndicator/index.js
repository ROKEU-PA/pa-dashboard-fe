import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import moment from "moment";
import "moment/locale/id";
import { useBudgetExecution } from "@/hooks/useBudgetExecution";
import { DetailsIKPA } from "./DetailsIKPA";
import { useFetchIKPA } from "../Ikpa/hooks/useFetchIKPA";

function PerformanceIndicator() {
  const [currentPeriod] = useState({
    year: moment().year(),
    month: moment().subtract(30, "days").format("M"),
  });

  const [filter] = useState({
    searchKey: "",
    eselonKey: "all",
    year: moment().year(),
    month: "",
  });

  const { KemnakerRate, filteredData, refetch, mapColorByValueIndicator } =
    useBudgetExecution();

  const {
    data: dataTable,
    refetchIkpas,
    loading,
  } = useFetchIKPA({
    eselonCode: filter?.eselonKey,
    searchKey: filter?.searchKey,
    month: filter?.month,
    year: filter?.year,
  });

  useEffect(() => {
    refetch(currentPeriod);
    refetchIkpas(currentPeriod);
  }, [currentPeriod]);

  const kemnakerCurrent = parseFloat(KemnakerRate?.nilaiIKPA || 0);
  const kemnakerPrev = parseFloat(KemnakerRate?.prevNilaiIKPA || 0);
  const isKemnakerUp = kemnakerCurrent >= kemnakerPrev;

  return (
    <div>
      <div className="grid grid-cols-5 gap-x-4 gap-y-0 mb-4 bg-[#F1FAFF] rounded-lg justify-between">
        {/* KARTU BESAR BIRU (KEMNAKER) */}
        <div className="row-span-2 z-0 h-full">
          <div className="lg:row-span-2 relative bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] text-white rounded-xl px-7 py-16 md:py-20 lg:py-24 flex flex-col justify-between overflow-hidden h-full">
            <div className="flex flex-col gap-1 z-10">
              <span className="font-bold text-lg md:text-2xl lg:text-4xl">
                Nilai IKPA
              </span>
              <span className="font-medium text-lg md:text-2xl opacity-90">
                {moment(currentPeriod?.month, "M").format("MMM")}{" "}
                {currentPeriod?.year}
              </span>
            </div>
            <div className="my-8 z-10">
              <span className="text-4xl md:text-5xl lg:text-7xl font-bold">
                {KemnakerRate?.nilaiIKPA ?? "-"}
              </span>
              <div
                className={`w-20 h-5 mt-3 ${mapColorByValueIndicator(KemnakerRate?.nilaiIKPA)} rounded-sm border-2 border-white flex-shrink-0`}
              ></div>

              {/* INDIKATOR TREND KEMNAKER */}
              <div className="flex mt-5 items-center justify-start gap-2 lg:gap-4">
                {isKemnakerUp ? (
                  // Panah Hijau (Naik)
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-[30px] lg:h-[30px] text-[#A3E635] flex-shrink-0"
                  >
                    <path d="M12 2L22 20H2z" />
                  </svg>
                ) : (
                  // Panah Merah (Turun)
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-[40px] lg:h-[40px] text-red-500 flex-shrink-0"
                  >
                    <path d="M12 22L2 4h20z" />
                  </svg>
                )}
                {/* Nilai Bulan Lalu (Kuning) */}
                <span className="text-xl md:text-2xl lg:text-4xl font-black leading-none tracking-tight text-[#FACC15]">
                  {KemnakerRate?.prevNilaiIKPA ?? "-"}
                </span>
              </div>
            </div>
            <span className="font-semibold text-4xl md:text-2xl leading-tight z-10">
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
              alt={"decor-2"}
              className={`absolute left-[-5rem] top-[-4.5rem] rotate-[-186.75deg] z-3`}
              loading="eager"
              width={250}
            />
          </div>
        </div>

        {/* KARTU KECIL PUTIH (ESELON) */}
        {filteredData &&
          filteredData.map((item, index) => {
            // ==========================================
            // LOGIKA ESELON (KARTU KECIL)
            // ==========================================
            const itemCurrent = parseFloat(item?.value || 0);
            // Pastikan API lu ngirim field 'prevValue'
            const itemPrev = parseFloat(item?.prevValue || 0);
            const isItemUp = itemCurrent >= itemPrev;

            return (
              <div
                key={index}
                className={`bg-white rounded-xl py-2 px-3 flex flex-col my-4 ml-[-3rem] mr-[3rem] z-10`}
              >
                <div className="mb-2">
                  <span
                    className={`mt-2 inline-block text-lg md:text-lg font-semibold px-2 py-1 rounded text-[#FFFFFF] bg-gradient-to-b from-[#59C7FF] to-[#2F8AFD] `}
                  >
                    {item.title === "Barenbang Ketenagakerjaan"
                      ? "BARENBANG NAKER"
                      : (item.title.toUpperCase() ?? "-")}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-black leading-none py-4">
                    {item.value ?? "-"}
                  </span>
                  <div></div>
                  <div
                    className={`w-5 h-12 ml-5 mt-6 ${mapColorByValueIndicator(item?.value)} rounded-sm flex-shrink-0`}
                  ></div>

                  {/* INDIKATOR TREND ESELON */}
                  <div className="flex items-center justify-start gap-2 lg:gap-4 col-span-3 mt-2">
                    {isItemUp ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-[24px] lg:h-[24px] text-[#A3E635] flex-shrink-0"
                      >
                        <path d="M12 2L22 20H2z" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-[24px] lg:h-[24px] text-red-500 flex-shrink-0"
                      >
                        <path d="M12 22L2 4h20z" />
                      </svg>
                    )}
                    {/* Nilai Bulan Lalu (Kuning) */}
                    <span className="text-lg md:text-xl lg:text-2xl font-black leading-none tracking-tight text-[#FACC15]">
                      {item?.prevValue ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {/* KETERANGAN LEGENDA */}
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

            <div className="flex mt-5 items-center gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-[20px] lg:h-[20px] text-[#A3E635] flex-shrink-0"
                >
                  <path d="M12 2L22 20H2z" />
                </svg>
                <span>atau</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-[20px] lg:h-[20px] text-red-500 flex-shrink-0"
                >
                  <path d="M12 22L2 4h20z" />
                </svg>
                <span>:</span>
                <span className="font-medium whitespace-wrap">
                  Kenaikan atau penurunan nilai IKPA dari bulan sebelumnya
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <DetailsIKPA dataTable={dataTable} loading={loading} />
      </div>
    </div>
  );
}

export default PerformanceIndicator;
