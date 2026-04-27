import React, { useEffect, useState, useCallback, useContext } from "react";
import { Users, GraduationCap, ChartColumn, Activity } from "lucide-react";
import moment from "moment";
import Card from "@/components/Card";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import { apiRequest } from "@/services/APIHelper"; 
import { AppContext } from "@/contexts/AppContext";

function Administrator() {
  const { token } = useContext(AppContext);
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [ikkData, setIkkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const monthOptions = moment.months().map((name, index) => ({
    value: index + 1,
    label: name
  }));

  const [yearGaji, setYearGaji] = useState(new Date().getFullYear());
  const [yearHadir, setYearHadir] = useState(new Date().getFullYear());
  const [monthHadir, setMonthHadir] = useState(new Date().getMonth() + 1);

  const getSafeToken = useCallback(() => {
    const savedAuth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  
    const finalToken =
      token ||                        
      savedAuth?.accessToken ||      
      localStorage.getItem("token")  
      || null;
  
    return finalToken;
  }, [token]);

  const fetchData = useCallback(async () => {
  const activeToken = getSafeToken(); 
  
  if (!activeToken) return;
  console.log("Fetching data untuk Tahun Gaji:", yearGaji, "Tahun Hadir:", yearHadir);
  setLoading(true);
  
  try {
  

    const resEmployee = await apiRequest({ url: "/administration/employee", token: activeToken });
    const resIkk = await apiRequest({ url: "/administration/index", token: activeToken });
    const resAtt = await apiRequest({ url: `/administration/attendance?year=${yearHadir}&month=${monthHadir}`, token: activeToken });
    const resSal = await apiRequest({ url: `/administration/salary?year=${yearGaji}`, token: activeToken });

    if (resEmployee?.success) setEmployeeData(resEmployee.data);
    if (resIkk?.success) setIkkData(resIkk.data);
    if (resAtt?.success) setAttendanceData(resAtt.data[0] || null);
    if (resSal?.success) setSalaryData(resSal.data || []);

  } catch (error) {
    console.error("Kesalahan Auth:", error.message);
  } finally {
    setLoading(false);
  }
}, [getSafeToken, yearGaji, yearHadir, monthHadir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getIkkVal = (key) => ikkData?.[key] || { target: 0, realisasi: 0 };

  if (loading) return <div className="p-20 text-center font-bold text-blue-500">Memuat Data...</div>;
  
  if (errorStatus) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold mb-4">{errorStatus}</p>
      <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Coba Lagi</button>
    </div>
  );

  const chartPegawai = [
    { name: "Pria", value: employeeData?.jumlah_pegawai?.pria || 0 },
    { name: "Wanita", value: employeeData?.jumlah_pegawai?.wanita || 0 },
  ];

  const chartPendidikan = [
    { name: "Diploma", value: employeeData?.pendidikan_pegawai?.diploma || 0 },
    { name: "Sarjana", value: employeeData?.pendidikan_pegawai?.sarjana || 0 },
    { name: "Magister", value: employeeData?.pendidikan_pegawai?.magister || 0 },
  ];

  const chartKehadiran = [
    { name: "Hadir", value: attendanceData?.hadir || 0 },
    { name: "Alfa", value: attendanceData?.tidak_hadir || 0 },
    { name: "Telat", value: attendanceData?.telat || 0 },
  ];

  const chartGaji = {
    labels: salaryData.length > 0 ? salaryData.map(item => moment().month(item.month - 1).format("MMM")) : ["-"],
    values: salaryData.length > 0 ? salaryData.map(item => item.nilai) : [0]
  };

  

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="relative h-[400px] rounded-[2rem] shadow-sm border-none bg-white p-6">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-white shadow-sm">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Jumlah Pegawai</h3>
            <DonutChart dataset={chartPegawai} colors={["#47B5FF", "#616484"]} height="h-60" />
            <div className="flex flex-row justify-between w-full px-4 mt-6">
              <LegendItem color="bg-[#EDFF00]" label="Total" value={employeeData?.jumlah_pegawai?.total || 0} />
              <LegendItem color="bg-[#47B5FF]" label="Pria" value={employeeData?.jumlah_pegawai?.pria || 0} />
              <LegendItem color="bg-[#616484]" label="Wanita" value={employeeData?.jumlah_pegawai?.wanita || 0} />
            </div>
          </Card>

          <Card className="relative h-[400px] rounded-[2rem] shadow-sm border-none bg-white p-6">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-white shadow-sm">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Pendidikan Pegawai</h3>
            <DonutChart dataset={chartPendidikan} colors={["#EDFF00", "#47B5FF", "#616484"]} height="h-60" />
            <div className="flex flex-row justify-between w-full px-4 mt-6">
              <LegendItem color="bg-[#EDFF00]" label="Diploma" value={employeeData?.pendidikan_pegawai?.diploma || 0} />
              <LegendItem color="bg-[#47B5FF]" label="Sarjana" value={employeeData?.pendidikan_pegawai?.sarjana || 0} />
              <LegendItem color="bg-[#616484]" label="Magister" value={employeeData?.pendidikan_pegawai?.magister || 0} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <Card className="relative h-[410px] rounded-[2rem] shadow-sm border-none bg-white p-6">
             <div className="flex justify-between items-center">
              <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 border border-white shadow-sm">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Rekap Kehadiran Bulanan</h3>
              <div className="flex items-center bg-white p-2  gap-3">
               <select 
                value={monthHadir}
                onChange={(e) => {
                const selected = parseInt(e.target.value);
                setMonthHadir(selected); }} className="rounded-lg shadow p-2 ">
              {monthOptions.map((month) => (<option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
             <select 
                value={yearHadir}
                onChange={(e) => {
                const selected = parseInt(e.target.value);
                setYearHadir(selected); }} className="rounded-lg shadow p-2 ">
              {yearOptions.map(yr => (<option key={yr} value={yr}>{yr}</option>))}
            </select>
            </div>
            </div>
            <DonutChart dataset={chartKehadiran} colors={["#EDFF00", "#47B5FF", "#616484"]} height="h-60" />
            <div className="flex flex-row justify-between w-full px-4 mt-4">
              <LegendItem color="bg-[#EDFF00]" label="Hadir" value={attendanceData?.hadir || 0} />
              <LegendItem color="bg-[#47B5FF]" label="Alfa" value={attendanceData?.tidak_hadir || 0} />
              <LegendItem color="bg-[#616484]" label="Telat" value={attendanceData?.telat || 0} />
            </div>
          </Card>

          <Card className="relative h-[410px] p-6 rounded-[2rem] shadow-sm border-none bg-white">
            <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 border border-white shadow-sm">
              <ChartColumn size={20} />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Kenaikan Gaji Berkala</h3>
             <select 
                value={yearGaji}
                onChange={(e) => {
                const selected = parseInt(e.target.value);
                setYearGaji(selected); }}
              className="bg-gray-20 p-2 rounded-lg shadow"
            >
              {yearOptions.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            </div>
            <div className="w-full pt-4">
              <BarChart dataset={chartGaji} height="h-72" isGajiChart={true} />
            </div>
          </Card>
        </div>

        <div className="relative p-6 rounded-[2rem] shadow-sm border-none bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-white shadow-sm">
            <Activity size={18} />
          </div>
          <IKKCard title="IKK Tindak Lanjut LK" dataset={{ labels: ["Realisasi", "Target"],values: [getIkkVal('ikk_tindak_lanjut_lk').realisasi, getIkkVal('ikk_tindak_lanjut_lk').target] }} />
          <IKKCard title="IKK Tingkat Maturitas SPIP" dataset={{labels: ["Realisasi", "Target"], values: [getIkkVal('ikk_tingkat_maturitas_spip').realisasi, getIkkVal('ikk_tingkat_maturitas_spip').target] }} />
          <IKKCard title="IKK Pengelolaan Aset" dataset={{labels: ["Realisasi", "Target"], values: [getIkkVal('ikk_pengelolaan_aset').realisasi, getIkkVal('ikk_pengelolaan_aset').target] }} />
          <IKKCard title="IKK IKPA" dataset={{labels: ["Realisasi", "Target"],  values: [getIkkVal('ikk_ikpa').realisasi, getIkkVal('ikk_ikpa').target] }} />
        </div>
      </div>
    </div>
  );
}

function IKKCard({ title, dataset }) {

    return (
      <Card className="h-[380px] m-2 border-none bg-gray-50/50 flex flex-col p-4 rounded-xl">
        <h4 className="font-bold text-gray-900 text-xs h-10 leading-tight mb-2">{title}</h4>
        <div className="flex-1 flex items-center justify-center"><BarChart dataset={dataset} height="h-56" /></div>
        <div className="flex justify-between  border-t border-gray-200">
          <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Realisasi</span><span className="text-lg font-bold text-gray-700">{dataset.values[0]}</span></div>
          <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Target</span><span className="text-lg font-bold text-sky-500">{dataset.values[1]}</span></div>
        </div>
      </Card>
    );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="text-center flex-1">
      <div className="flex flex-col md:flex-row items-center gap-1 justify-center mb-1">
        <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${color} block`}></span>
        <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">{label}</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-gray-900">{value}</span>
    </div>
  );
}

export default Administrator;