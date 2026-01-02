import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { apiRequest } from "@/services/APIHelper";
import { Download, Upload } from "lucide-react";
import { fetchHelperGET } from "@/services/FetchHelper";
import { toast } from "react-toastify";
import FileInput from "@/components/FileInput";
import Select from "@/components/Select";
import { AppContext } from "@/contexts/AppContext";
import User from "@/components/User";
import { useBudgetExecution } from "../BudgetExecution/useBudgetExecution";
import Card from "@/components/Card";
import { dataTable } from "../BudgetExecution/constants";

const columns = [
  {
    label: "Eselon",
    key: "eselon",
    rowSpan: 2,
  },
  {
    label: "Total",
    children: [
      { label: "Pagu", key: "total_pagu" },
      { label: "Realisasi", key: "total_realisasi" },
      { label: "Sisa", key: "total_sisa" },
    ],
  },
  {
    label: "Pegawai",
    children: [
      { label: "Pagu", key: "pegawai_pagu" },
      { label: "Realisasi", key: "pegawai_realisasi" },
      { label: "Sisa", key: "pegawai_sisa" },
    ],
  },
  {
    label: "Barang",
    children: [
      { label: "Pagu", key: "barang_pagu" },
      { label: "Realisasi", key: "barang_realisasi" },
      { label: "Sisa", key: "barang_sisa" },
    ],
  },
  {
    label: "Modal",
    children: [
      { label: "Pagu", key: "modal_pagu" },
      { label: "Realisasi", key: "modal_realisasi" },
      { label: "Sisa", key: "modal_sisa" },
    ],
  },
];

function RealisasiPage() {
  const { state, getIKPAColor } = useBudgetExecution("Hello");
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [dataTables, setDataTable] = useState([
    {
      eselon_code: "026",
      name: "KEMENTERIAN KETENAGAKERJAAN",
      per_jenis: {
        51: {
          pagu: 96400154000,
          realisasi: 77706174313,
          persentase_real: 80.61,
          sisa: 18693979687,
        },
        52: {
          pagu: 419166503000,
          realisasi: 128313046987,
          persentase_real: 30.61,
          sisa: 290853456013,
        },
        53: {
          pagu: 13469240000,
          realisasi: 6747777064,
          persentase_real: 50.1,
          sisa: 6721462936,
        },
      },
      pagu: 529035897000,
      realisasi: 212766998364,
      sisa: 316268898636,
      persen_realisasi: 40.22,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02601",
      name: "SEKRETARIAT JENDERAL",
      per_jenis: {
        51: {
          pagu: 96400154000,
          realisasi: 77706174313,
          persentase_real: 80.61,
          sisa: 18693979687,
        },
        52: {
          pagu: 419166503000,
          realisasi: 128313046987,
          persentase_real: 30.61,
          sisa: 290853456013,
        },
        53: {
          pagu: 13469240000,
          realisasi: 6747777064,
          persentase_real: 50.1,
          sisa: 6721462936,
        },
      },
      pagu: 529035897000,
      realisasi: 212766998364,
      sisa: 316268898636,
      persen_realisasi: 40.22,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02602",
      name: "INSPEKTORAT JENDERAL",
      per_jenis: {
        51: {
          pagu: 24802040000,
          realisasi: 19387652052,
          persentase_real: 78.17,
          sisa: 5414387948,
        },
        52: {
          pagu: 33080460000,
          realisasi: 12279610799,
          persentase_real: 37.12,
          sisa: 20800849201,
        },
        53: {
          pagu: 200000000,
          realisasi: 196092600,
          persentase_real: 98.05,
          sisa: 3907400,
        },
      },
      pagu: 58082500000,
      realisasi: 31863355451,
      sisa: 26219144549,
      persen_realisasi: 54.86,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02604",
      name: "DITJEN PEMBINAAN PENEMPATAN TENAGA KERJA DAN PERLUASAN KESEMPATAN KERJA",
      per_jenis: {
        51: {
          pagu: 60230900000,
          realisasi: 53107121066,
          persentase_real: 88.17,
          sisa: 7123778934,
        },
        52: {
          pagu: 742889574000,
          realisasi: 43079726203,
          persentase_real: 5.8,
          sisa: 699809847797,
        },
        53: {
          pagu: 1000000000,
          realisasi: 994921362,
          persentase_real: 99.49,
          sisa: 5078638,
        },
      },
      pagu: 804120474000,
      realisasi: 97181768631,
      sisa: 706938705369,
      persen_realisasi: 12.09,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02605",
      name: "DITJEN PEMBINAAN HUBUNGAN INDUSTRIAL DAN JAMINAN SOSIAL TENAGA KERJA",
      per_jenis: {
        51: {
          pagu: 35837912000,
          realisasi: 31738116022,
          persentase_real: 88.56,
          sisa: 4099795978,
        },
        52: {
          pagu: 11737435764000,
          realisasi: 9384006887918,
          persentase_real: 79.95,
          sisa: 2353428876082,
        },
        53: {
          pagu: 7212500000,
          realisasi: 6999000,
          persentase_real: 0.1,
          sisa: 7205501000,
        },
      },
      pagu: 11780486176000,
      realisasi: 9415752002940,
      sisa: 2364734173060,
      persen_realisasi: 79.93,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02608",
      name: "DITJEN PEMBINAAN PENGAWASAN KETENAGAKERJAAN DAN KESELAMATAN DAN KESEHATAN KERJA",
      per_jenis: {
        51: {
          pagu: 92824800000,
          realisasi: 74654464053,
          persentase_real: 80.43,
          sisa: 18170335947,
        },
        52: {
          pagu: 190287708000,
          realisasi: 45925875840,
          persentase_real: 24.13,
          sisa: 144361832160,
        },
        53: {
          pagu: 7455653000,
          realisasi: 819232700,
          persentase_real: 10.99,
          sisa: 6636420300,
        },
      },
      pagu: 290568161000,
      realisasi: 121399572593,
      sisa: 169168588407,
      persen_realisasi: 41.78,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02611",
      name: "BADAN PERENCANAAN DAN PENGEMBANGAN KETENAGAKERJAAN",
      per_jenis: {
        51: {
          pagu: 26877940000,
          realisasi: 21586633652,
          persentase_real: 80.31,
          sisa: 5291306348,
        },
        52: {
          pagu: 166526226000,
          realisasi: 56890278699,
          persentase_real: 34.16,
          sisa: 109635947301,
        },
        53: {
          pagu: 25420000000,
          realisasi: 19625000,
          persentase_real: 0.08,
          sisa: 25400375000,
        },
      },
      pagu: 218824166000,
      realisasi: 78496537351,
      sisa: 140327628649,
      persen_realisasi: 35.87,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
    {
      eselon_code: "02613",
      name: "DIREKTORAT JENDERAL PEMBINAAN PELATIHAN VOKASI DAN PRODUKTIVITAS",
      per_jenis: {
        51: {
          pagu: 296279510000,
          realisasi: 270348230220,
          persentase_real: 91.25,
          sisa: 25931279780,
        },
        52: {
          pagu: 1215695350000,
          realisasi: 286004822265,
          persentase_real: 23.53,
          sisa: 929690527735,
        },
        53: {
          pagu: 68179899000,
          realisasi: 19883006417,
          persentase_real: 29.16,
          sisa: 48296892583,
        },
      },
      pagu: 1580154759000,
      realisasi: 576236058902,
      sisa: 1003918700098,
      persen_realisasi: 36.47,
      bulan: 10,
      tahun: 2025,
      tanggal_sumber_data: "2025-10-30 07:17:57",
    },
  ]);
  const [es1Data, setEs1Data] = useState([]);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });
  const [cardsData, setCardsData] = useState([]);
  const formatMiliar = (num) => {
    if (!num && num !== 0) return "-";
    return (num / 1_000_000_000).toFixed(2) + " M";
  };
  // const fetchTable = async () => {
  //   try {
  //     const query = buildQueryString({
  //       eselon_code: filter.eselonKey,
  //       search_key: filter.searchKey,
  //     });
  //     const data = await apiRequest({
  //       url: `/api/pa/ikpa/all?${query}`,
  //     });
  //     let result = data?.data;
  //     if (data.success) {
  //       setDataTable(result);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const es1Options = async () => {
    try {
      const data = { success: true, data: dataTables };

      if (!data?.success || !data?.data) return;
      let mapped = data.data
        // .filter((q) => q.satker_code === null)
        .map((item, index) => {
          const constantItem = dataTable.data[index];
          const perJenis = item.per_jenis || {};

          const totalPagu = item.pagu || 0;
          const totalRealisasi = item.realisasi || 0;
          const totalPersen = item.persen_realisasi || 0;
          const totalSisa = item.sisa || 0;

          const pegawai = perJenis["51"] || {};
          const barang = perJenis["52"] || {};
          const modal = perJenis["53"] || {};

          return {
            title: constantItem?.eselon || item.name,
            pagu: totalPagu,
            realisasiNominal: totalRealisasi,
            realisasiPersen: totalPersen,
            blokir: totalSisa,
            blokirPersen: ((totalSisa / totalPagu) * 100).toFixed(2),
            targetNominal: totalPagu * 0.95,
            targetPersen: 95,
          };
        });

      console.log("cardsData mapped:", mapped);
      setCardsData(mapped);
    } catch (error) {
      console.error("Error mapping data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const submitData = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("excel", formData.dokumen);

      const result = await apiRequest({
        url: "/api/pa/realization/import",
        method: "POST",
        options: {
          body: payload,
        },
        isMultiType: true,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    let isAnyFile = formData?.dokumen || formData?.document;

    try {
      if (isAnyFile) {
        if (!formData.dokumen) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }

      submitData(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil disimpan!");
      setIsOpenModal(false);
      setFormData({
        dokumen: null,
      });
      // fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const groupedData = dataTables.reduce((acc, row) => {
    const group = row.eselon_code;
    if (!acc[group]) acc[group] = { parent: null, children: [] };

    if (!row.satker_code) {
      acc[group].parent = row;
    } else {
      acc[group].children.push(row);
    }

    return acc;
  }, {});

  useEffect(() => {
    // fetchTable();
    es1Options();
  }, [filter.searchKey, filter.eselonKey]);

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Pelaksanaan Anggaran / Realisasi", path: "/realisasi" },
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
      <Title>Realisasi</Title>
      <Paper style={{ marginBottom: "1vw" }}>
        <div className="grid grid-cols-3 gap-4 mb-4 mt-4">
          {/* CARD INDEX 0 (TOTAL) */}
          <Card className="row-span-2 p-4 bg-white shadow-md rounded-2xl border border-gray-100">
            <div className="flex flex-col items-center mb-3">
              <span className="font-bold text-2xl text-center text-gray-800">
                REALISASI
              </span>
            </div>

            {/* Total Pagu */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-lg px-3 py-2 text-white flex flex-col m-1 shadow-sm">
              <span className="font-semibold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2 rounded"></span> TOTAL
                PAGU
              </span>
              <span className="font-bold text-lg">
                Rp {(2123 / 1_000).toFixed(2)} M
              </span>
            </div>

            {/* Blokir */}
            <div className="bg-gradient-to-r from-[#EF4444] to-[#F87171] rounded-lg px-3 py-2 text-white flex flex-col m-1 shadow-sm">
              <span className="font-semibold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2 rounded"></span> BLOKIR
              </span>
              <span className="font-bold text-lg flex justify-between">
                <span>Rp {(2123 / 1_000).toFixed(2)} M</span>
                <span>(20%)</span>
              </span>
            </div>

            {/* Realisasi */}
            <div className="bg-gradient-to-r from-[#15803D] to-[#4ADE80] rounded-lg px-3 py-2 text-white flex flex-col m-1 shadow-sm">
              <span className="font-semibold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2 rounded"></span>{" "}
                REALISASI
              </span>
              <span className="font-bold text-lg flex justify-between">
                <span>Rp {(2123 / 1_000).toFixed(2)} M</span>
                <span>▲ 58%</span>
              </span>
            </div>

            {/* Target */}
            <div className="bg-gradient-to-r from-[#FACC15] to-[#FDE68A] rounded-lg px-3 py-2 text-gray-900 flex flex-col m-1 shadow-sm">
              <span className="font-semibold text-sm flex items-center">
                <span className="w-1 h-4 bg-black mr-2 rounded"></span> TARGET
              </span>
              <span className="font-bold text-lg flex justify-between">
                <span>Rp {(88239 / 1_000).toFixed(2)} M</span>
                <span>▼ 22%</span>
              </span>
            </div>

            {/* Bulan */}
            <div className="bg-gradient-to-b from-[#3B82F6] to-[#1E40AF] rounded-lg text-center m-1 py-1.5 shadow-sm">
              <span className="font-semibold text-sm text-white">
                Bulan{" "}
                {moment().locale("id").subtract(1, "months").format("MMMM")}
              </span>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center mb-3">
              <span className="font-semibold text-sm text-center mt-1 text-gray-700">
                Kementerian Ketenagakerjaan
              </span>
            </div>
          </Card>

          {/* CARD PER UNIT (INDEX > 0) */}
          {cardsData
            ?.filter((_, index) => index !== 0)
            .map((item, index) => {
              const realisasiNaik = item.realisasiPersen >= 50; // contoh logika
              const targetNaik = item.targetPersen >= 50;

              return (
                <Card
                  key={index}
                  className="p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800 text-[15px] tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2 text-sm font-medium">
                    {/* Pagu */}
                    <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-lg px-3 py-2 flex justify-between">
                      <span>Pagu:</span>
                      <span>Rp {(item.pagu / 1_000_000_000).toFixed(2)} M</span>
                    </div>

                    {/* Blokir */}
                    <div className="bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white rounded-lg px-3 py-2 flex justify-between">
                      <span>Blokir:</span>
                      <span>
                        Rp {(item.blokir / 1_000_000_000).toFixed(2)} M (
                        {item.blokirPersen}%)
                      </span>
                    </div>

                    {/* Realisasi */}
                    <div className="bg-gradient-to-r from-[#15803D] to-[#4ADE80] text-white rounded-lg px-3 py-2 flex justify-between">
                      <span>Realisasi:</span>
                      <span>
                        Rp {(item.realisasiNominal / 1_000_000_000).toFixed(2)}{" "}
                        M {realisasiNaik ? "▲" : "▼"} {item.realisasiPersen}%
                      </span>
                    </div>

                    {/* Target */}
                    <div className="bg-gradient-to-r from-[#FACC15] to-[#FDE68A] text-gray-900 rounded-lg px-3 py-2 flex justify-between">
                      <span>Target:</span>
                      <span>
                        Rp {(item.targetNominal / 1_000_000_000).toFixed(2)} M{" "}
                        {targetNaik ? "▲" : "▼"} {item.targetPersen}%
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </Paper>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: "1rem",
            justifyContent: "space-between",
          }}
        >
          <Input
            label="Search"
            style={{ width: "200px" }}
            name="Search"
            value={filter.searchKey}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                searchKey: e.target.value,
              }))
            }
          />
          <Select
            label="Eselon 1"
            name="eselon_code"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                eselonKey: e.target.value ?? "",
              }))
            }
            value={filter.eselonKey}
            options={es1Data.map((q) => ({
              label: q.name,
              value: q.eselon_code,
            }))}
            style={{ width: "120vh" }}
            isOpen={selectOpen}
            setIsOpen={setSelectOpen}
          />
          <div style={{ display: "flex", gap: 10 }}>
            {userData &&
              (userData.role === "admin" ||
                userData.role === "super_admin") && (
                <Button
                  onClick={() => setIsOpenModal(true)}
                  style={{ width: "fit-content" }}
                  variant="secondary"
                  icon={<Upload size={20} />}
                >
                  Import Data IKPA
                </Button>
              )}
            {/* <Button
              onClick={fetchTemplateDownload}
              style={{ width: "fit-content" }}
              variant="primary"
              icon={<Download size={20} />}
            >
              Download Template
            </Button> */}
          </div>
        </div>
        <div className="overflow-x-auto max-w-full md:max-w-[90vw] lg:max-w-[83vw]">
          <Table className="min-w-max w-full border-collapse" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHeader>
              {/* Baris pertama */}
              <TableRow>
                {columns.map((col, index) =>
                  col.children ? (
                    <TableCell
                      key={index}
                      align="center"
                      colSpan={col.children.length}
                    >
                      {col.label}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={index}
                      align="center"
                      rowSpan={col.rowSpan || 1}
                    >
                      {col.label}
                    </TableCell>
                  )
                )}
              </TableRow>

              {/* Baris kedua */}
              <TableRow>
                {columns.map((col) =>
                  col.children
                    ? col.children.map((child, idx) => (
                        <TableCell key={child.key || idx} align="center">
                          {child.label}
                        </TableCell>
                      ))
                    : null
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataTables.map((item, index) => (
                <TableRow key={item.eselon_code}>
                  {/* Kolom Eselon */}
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </TableCell>

                  {/* --- Kolom Total --- */}
                  <TableCell align="right">
                    {item.pagu.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">
                    {item.realisasi.toLocaleString("id-ID")}
                    <br />
                    <span style={{ color: "#888", fontSize: "1em" }}>
                      ({item.persen_realisasi.toFixed(2)}%)
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    {item.sisa.toLocaleString("id-ID")}
                  </TableCell>

                  {/* --- Kolom Pegawai (jenis_belanja = 51) --- */}
                  <TableCell align="right">
                    {item.per_jenis["51"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["51"] ? (
                      <>
                        {item.per_jenis["51"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["51"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["51"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>

                  {/* --- Kolom Barang (jenis_belanja = 52) --- */}
                  <TableCell align="right">
                    {item.per_jenis["52"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["52"] ? (
                      <>
                        {item.per_jenis["52"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["52"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["52"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>

                  {/* --- Kolom Modal (jenis_belanja = 53) --- */}
                  <TableCell align="right">
                    {item.per_jenis["53"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["53"] ? (
                      <>
                        {item.per_jenis["53"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["53"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {item.per_jenis["53"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Modal
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setFormData({
            dokumen: null,
          });
        }}
        title="Form Upload Excel"
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <FileInput
            accept=".xlsx"
            label="Dokumen"
            name="dokumen"
            onChange={handleChange}
            required
            value={formData?.dokumen}
          />
          <Button type="submit" style={{ float: "right" }}>
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default RealisasiPage;
