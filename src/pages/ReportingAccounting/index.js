import React, { useEffect, useState, useCallback, useContext } from "react";
import Card from "@/components/Card";
import BarChart from "./BarChart"; 
import { MessageSquareText, ArrowUpDown, DollarSign } from "lucide-react";
import { apiRequest } from "@/services/APIHelper"; 
import { AppContext } from "@/contexts/AppContext";

function AkuntansiPelaporan() {
  const { userData, token } = useContext(AppContext);
  const [dataOpini, setDataOpini] = useState([]);
  const [dataMaturitas, setDataMaturitas] = useState({ current: 0, target: 0 });
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

 const getSafeToken = useCallback(() => {
  const savedAuth = JSON.parse(sessionStorage.getItem("auth") || "{}");

  const finalToken =
    token ||                        
    savedAuth?.accessToken ||      
    localStorage.getItem("token")  
    || null;

  return finalToken;
}, [token]);

  const fetchAklapData = useCallback(async () => {
    const activeToken = getSafeToken();
    if (!activeToken) {
        console.error("Token tidak ditemukan!");
        setLoading(false);
        return;
      }
    setLoading(true);
    try {
      const [resOpini, resMaturitas, resReport] = await Promise.all([
        apiRequest({ url: "/accounting/opinion", method: "GET", token: activeToken }),
        apiRequest({ url: "/accounting/maturity", method: "GET", token: activeToken }),
        apiRequest({ url: "/accounting/report", method: "GET", token: activeToken })
      ]);

      if (resOpini?.success) {
        const mapped = resOpini.data.map(item => ({
          year: item.tahun,
          label: (item.value || "").toUpperCase(),
          img: (item.value || "").toLowerCase() === "wtp" ? "/trophy-gold.png" : "/trophy-black.png"
        }));
        setDataOpini(mapped);
      }

     if (resMaturitas?.success && Array.isArray(resMaturitas.data)) {
        const mat2024 = resMaturitas.data.find(d => String(d.year) === "2024");
        const mat2025 = resMaturitas.data.find(d => String(d.year) === "2025");
        setDataMaturitas({
          current: mat2024?.value || 0,
          target: mat2025?.target || 0 
        });
      }

      if (resReport?.success && resReport?.data) {
        setReports(resReport.data);
      }

    } catch (error) {
      console.error("Gagal ambil data AKLAP:", error);
    } finally {
      setLoading(false);
    }
  }, [getSafeToken]);

  useEffect(() => {
    fetchAklapData();
  }, [fetchAklapData]);

  const getVal = (category, year, typeName, subTitle) => {
    if (!reports || !reports[category] || !reports[category][year]) return 0;
    const found = reports[category][year].find(d => {
    const matchType = d.type?.toLowerCase() === typeName.toLowerCase();
   
    if (subTitle) {
      return matchType && d.sub_title?.toLowerCase().includes(subTitle.toLowerCase());
    }
    return matchType;
  });
    return found ? found.value : 0;
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-500">Memuat Data Akuntansi...</div>;

  return (
    <div>
      <div className=" space-y-5 ">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pt-2 ">
          <Card className="relative mb-2 md:h-[410px]">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-[#ecfdf3] flex items-center justify-center text-[#bcdd51] shadow-sm border border-white">
              <MessageSquareText size={20} />
            </div>
            <h2 className="font-bold text-2xl mb-2">
              Opini Badan Pemeriksa Keuangan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 justify-items-center">
                {dataOpini.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-sm text-gray-500">{item.year}</span>

                  <div className="relative flex items-center justify-center my-2">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-20 h-20 md:w-25 md:h-25 object-contain"
                    />
                  </div>

                  <span
                    className={`font-semibold text-base ${
                      item.comingSoon ? "italic text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="relative md:h-[410px] ">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-[#ffcfe2] flex items-center justify-center text-green-600 shadow-sm border border-white">
                  <div className=" w-6 h-6 rounded-full bg-[#fc0166] flex items-center justify-center text-[#ffcfe2] shadow-sm border border-white">
                    <ArrowUpDown size={15} />
                  </div>
                </div>
                <span className="font-semibold text-2xl">
                  Nilai Maturitas SPIP
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4 md:mt-12">
              {/* BOX 1 */}
              <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                <div className="bg-[#898a8d] rounded-3xl text-center h-[140px] md:h-[180px] w-full md:w-[260px] flex items-center justify-center shadow-md">
                  <span className="text-5xl font-black text-white scale-y-125">{dataMaturitas.current}</span>
                </div>
                <span className="text-base md:text-lg font-medium">
                  Nilai SPIP Tahun 2024
                </span>
              </div>

              <div className="hidden md:block h-[200px] border-l-2 border-dashed border-gray-300 mx-4"></div>
              <div className="block md:hidden w-[80%] border-t-2 border-dashed border-gray-300 my-2"></div>

              <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                <div className="bg-gradient-to-r from-[#59c7ff] to-[#2f8afd] rounded-3xl text-center h-[140px] md:h-[180px] w-full md:w-[260px] flex items-center justify-center shadow-md">
                  <span className="text-5xl font-black text-white scale-y-125">{dataMaturitas.target}</span>
                </div>
                <span className="text-base md:text-lg font-medium">
                  Target SPIP Tahun 2025
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-[#fff3d0] flex items-center justify-center shadow-sm border border-white z-20">
            <div className="w-6 h-6 rounded-full bg-[#ffbe02] flex items-center justify-center text-white">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                LRA 30 Juni 2024 & 2025
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BarChart 
                  title="Pendapatan"
                  categories={["Anggaran", "Realisasi"]} 
                  data2025={[
                    getVal('lra', '2025', 'anggaran', 'pendapatan'), 
                    getVal('lra', '2025', 'realisasi', 'pendapatan')
                  ]}
                  data2024={[
                    getVal('lra', '2024', 'anggaran', 'pendapatan'), 
                    getVal('lra', '2024', 'realisasi', 'pendapatan')
                  ]}
                />
                <BarChart 
                  title="Belanja"
                  categories={["Anggaran", "Realisasi"]} 
                  data2025={[
                    getVal('lra', '2025', 'anggaran', 'belanja'), 
                    getVal('lra', '2025', 'realisasi', 'belanja')
                  ]}
                  data2024={[
                    getVal('lra', '2024', 'anggaran', 'belanja'), 
                    getVal('lra', '2024', 'realisasi', 'belanja')
                  ]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Neraca Semester I
              </h1>
             <BarChart 
               data2025={[getVal('neraca', '2025', 'aset'), getVal('neraca', '2025', 'kewajiban'), getVal('neraca', '2025', 'ekuitas')]}
               data2024={[getVal('neraca', '2024', 'aset'), getVal('neraca', '2024', 'kewajiban'), getVal('neraca', '2024', 'ekuitas')]}
               categories={["Aset", "Kewajiban", "Ekuitas"]}
            />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                LPE Semester I
              </h1>
                <BarChart 
                  data2025={[
                    getVal('lpe', '2025', 'ekuitas awal'), 
                    getVal('lpe', '2025', 'surplus/defisit-lo'), 
                    getVal('lpe', '2025', 'koreksi yang menambah/mengurangi ekuitas'),
                    getVal('lpe', '2025', 'transaksi antar entitas'),
                    getVal('lpe', '2025', 'kenaikan/penurunan ekuitas'),
                    getVal('lpe', '2025', 'ekuitas akhir')
                  ]}
                  data2024={[
                    getVal('lpe', '2024', 'ekuitas awal'), 
                    getVal('lpe', '2024', 'surplus/defisit-lo'), 
                    getVal('lpe', '2024', 'koreksi yang menambah/mengurangi ekuitas'),
                    getVal('lpe', '2024', 'transaksi antar entitas'),
                    getVal('lpe', '2024', 'kenaikan/penurunan ekuitas'),
                    getVal('lpe', '2024', 'ekuitas akhir')
                  ]}
                  categories={["Awal", "Surplus/Defisit LO", "koreksi ekuitas", "Transaksi Entitas", "Kenaikan","Akhir"]}
                />
            </div>
            <div className="space-y-4">
              <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                LO Semester I 
              </h1>
              <BarChart 
                title="Belanja"
                data2025={[
                    getVal('lo', '2025', 'surplus/defisit dari kegiatan op'), 
                    getVal('lo', '2025', 'surplus/defisit dari kegiatan non op'), 
                    getVal('lo', '2025', 'surplus/defisit sebelum pos luar biasa'),
                    getVal('lo', '2025', 'surplus/defisit lo'),
                  ]}
                  data2024={[
                    getVal('lo', '2024', 'surplus/defisit dari kegiatan op'), 
                    getVal('lo', '2024', 'surplus/defisit dari kegiatan non op'), 
                    getVal('lo', '2024', 'surplus/defisit sebelum pos luar biasa'),
                    getVal('lo', '2024', 'surplus/defisit lo'),
                  ]}
                categories={["OP","No OP","Sebelum Pos", "LO"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AkuntansiPelaporan;
