import { dataTable } from "@/pages/BudgetExecution/constants";
import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { useEffect, useState } from "react";

export const useBudgetExecution = () => {
  const [data, setData] = useState([]);
  const [KemnakerRate, setKemnakerRate] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  function getIKPAColor(value) {
    const num = Number(value)
    if (num >= 95) {
      return "text-[#22c55e] bg-[#E4FAEC]";
    } else if (num >= 89) {
      return "text-[#3b82f6] bg-[#DEEAFD]";
    } else if (num >= 70) {
      return "text-[#000000] bg-[#ECFD2E]";
    } else {
      return "text-[#ef4444] bg-[#FCDCDC]";
    }
  }

  const fetchEs1Data = async (period) => {
    try {
      const data = await apiRequest({
        url: period
          ? `/pa/ikpa/all?${buildQueryString(period)}`
          : `/pa/ikpa/all?year=${moment().subtract(1, "years").year()}&month=1`,
      });
      console.log(data)
      if (!period) {
        let result = data?.data.filter((q) => q.satker_code === null);
        if (data.success) {
          result.unshift({ eselon_code: "all", name: "SEMUA SATKER" });
          setData(result);
        }
      } else {
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

        setKemnakerRate(mapped?.[0]);

        setData({
          columns: dataTable.columns,
          data: mapped,
        });

        let mappedCards = mapped
          .filter((q) => q.eselon !== "Kementerian Ketenagakerjaan")
          .map((item) => ({
            title: item.eselon,
            value: item.nilaiIKPA,
            color: mapColorByValue(item.nilaiIKPA),
          }));
        setFilteredData(mappedCards);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mapColorByValue = (ikpa) => {
    if (ikpa >= 95) return "bg-green-bg"; // Sangat Baik
    if (ikpa >= 89) return "bg-blue-bg"; // Baik
    if (ikpa >= 70) return "bg-[#ECFD2E]"; // Cukup
    return "bg-red-bg"; // Kurang
  };

  const mapColorByValueIndicator = (ikpa) => {
    if (ikpa >= 95) return "bg-[#6FCE00]"; // Sangat Baik
    if (ikpa >= 89) return "bg-[#2E70FD]"; // Baik
    if (ikpa >= 70) return "bg-[#ECFD2E]"; // Cukup
    return "bg-[#FF4155]"; // Kurang
  };

  const mapColorTextByValue = (ikpa) => {
    if (ikpa >= 95) return "text-green-text"; // Sangat Baik
    if (ikpa >= 89) return "text-blue-text"; // Baik
    if (ikpa >= 70) return "text-[#0000]-text"; // Cukup
    return "text-red-text"; // Kurang
  };

  useEffect(() => {
    fetchEs1Data();
  }, []);

  return {
    data,
    KemnakerRate,
    filteredData,
    refetch: fetchEs1Data,
    getIKPAColor,
    mapColorByValue,
    mapColorByValueIndicator,
    mapColorTextByValue,
  };
};
