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
  const [dataTables, setDataTable] = useState([]);
  const [es1Data, setEs1Data] = useState([]);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });
  const [cardsData, setCardsData] = useState([]);

  const fetchTemplateDownload = async () => {
    try {
      const response = await fetchHelperGET(
        process.env.REACT_APP_API_BASE_URL + `/api/pa/ikpa/format/download`,
        "GET",
        localStorage.getItem("token"),
        "blob"
      );
      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = "format_template_import_ikpa.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal fetch template:", error);
    }
  };

  const fetchTable = async () => {
    try {
      const query = buildQueryString({
        eselon_code: filter.eselonKey,
        search_key: filter.searchKey,
      });
      const data = await apiRequest({
        url: `/api/pa/ikpa/all?${query}`,
      });
      let result = data?.data;
      if (data.success) {
        setDataTable(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const es1Options = async () => {
    try {
      const data = await apiRequest({
        url: `/api/pa/ikpa/all`,
      });
      let result = data?.data.filter((q) => q.satker_code === null);
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
      if (data.success) {
        result.unshift({ eselon_code: "all", name: "SEMUA SATKER" });
        console.log(result);
        setEs1Data(result);
      }
      let mappedCards = mapped
        .filter((q) => q.eselon !== "Kementerian Ketenagakerjaan")
        .map((item) => ({
          title: item.eselon,
          value: item.nilaiIKPA.toFixed(2),
        }));
      setCardsData(mappedCards);
    } catch (error) {
      console.error(error);
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
        url: "/api/pa/ikpa/import",
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
      fetchTable();
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
    fetchTable();
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
      <Paper style={{marginBottom: "1vw"}}>
        <div className="grid grid-cols-3 gap-4 mb-4 mt-4">
          <Card className="row-span-2 p-4">
            <div className="flex flex-col items-center mb-3">
              <span className="font-bold text-2xl text-center">REALISASI</span>
            </div>
            {/* Total Pagu */}
            <div className="bg-gradient-to-r from-[#1B3B70] to-[#2D71FE] rounded-lg px-3 py-2 text-white flex flex-col m-1">
              <span className="font-bold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2"></span> TOTAL PAGU
              </span>
              <span className="font-bold text-lg">Rp. 2.123</span>
            </div>

            {/* Blokir */}
            <div className="bg-gradient-to-r from-[#fc0303] to-[#f59a9a] rounded-lg px-3 py-2 text-white flex flex-col m-1">
              <span className="font-bold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2"></span> BLOKIR
              </span>
              <span className="font-bold text-lg">Rp. 2.123 (20%)</span>
            </div>

            {/* Realisasi */}
            <div className="bg-gradient-to-r from-[#00a86b] to-[#7fffd4] rounded-lg px-3 py-2 text-white flex flex-col m-1">
              <span className="font-bold text-sm flex items-center">
                <span className="w-1 h-4 bg-white mr-2"></span> REALISASI
              </span>
              <span className="font-bold text-lg">Rp. 2.123</span>
            </div>

            {/* Target */}
            <div className="bg-gradient-to-r from-[#ffd724] to-[#f5e6a6] rounded-lg px-3 py-2 text-black flex flex-col m-1">
              <span className="font-bold text-sm flex items-center">
                <span className="w-1 h-4 bg-black mr-2"></span> TARGET
              </span>
              <span className="font-bold text-lg">22% | Rp. 88.239</span>
            </div>
            <div className="bg-gradient-to-b from-[#5C90FD] to-[#2D71FE] rounded-lg text-center m-1">
              <span className="font-bold text-sm text-white">
                Bulan{" "}
                {moment().locale("id").subtract(1, "months").format("MMMM")}
              </span>
            </div>

            <div className="flex flex-col items-center mb-3">
              <span className="font-bold text-sm text-center mt-1">
                Kementerian Ketenagakerjaan
              </span>
            </div>
          </Card>

          {/* Kartu detail per unit */}
          {cardsData.map((item, index) => (
            <Card className="p-3" key={index}>
              <div className="flex flex-col">
                <div className="flex justify-between items-center h-10">
                  <span className="font-bold text-base w-[300px]">
                    {item.title}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-white">
                <div className="bg-gradient-to-r from-[#1B3B70] to-[#2D71FE] rounded-md px-2 py-1 font-bold">
                  <div className="flex justify-between">
                    <span>Pagu :</span>
                    <span>Rp 1111</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#fc0303] to-[#f59a9a] rounded-md px-2 py-1 font-bold">
                  <div className="flex justify-between">
                    <span>Blokir :</span>
                    <span>Rp 222 (22%)</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#00a86b] to-[#7fffd4] rounded-md px-2 py-1 font-bold">
                  <div className="flex justify-between">
                    <span>Realisasi Anggaran :</span>
                    <span className="text-green-400">
                      {item.realisasi}%{" "}
                      <span>
                        {item.realisasiDelta > 0 ? "▲" : "▼"}{" "}
                        {item.realisasiDelta}%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#ffd724] to-[#f5e6a6] rounded-md px-2 py-1 font-bold">
                  <div className="flex justify-between">
                    <span className="text-black">Target Anggaran :</span>
                    <span className="text-red-500">
                      {item.target}%{" "}
                      <span>
                        {item.targetDelta > 0 ? "▲" : "▼"} {item.targetDelta}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {Object.entries(groupedData).map(([eselonCode, group], index) => (
              <React.Fragment key={eselonCode}>
                {/* Row utama (group) */}
                {group.parent && (
                  <TableRow
                    sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
                  >
                    {/* <TableCell align="center">
                      {group.parent.eselon_code}
                    </TableCell> */}
                    <TableCell align="center">{group.parent.name}</TableCell>
                    <TableCell align="center">
                      {group.parent.revisi_dipa}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.deviasi_hal3_dipa}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.realisasi_anggaran}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.belanja_kontraktual}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.penyelesaian_tagihan}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.pengelolaan_up_tup}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.capaian_output}
                    </TableCell>
                    <TableCell align="center">
                      {group.parent.dispensasi_spm}
                    </TableCell>
                    <TableCell align="center">
                      <div
                        className={`p-1 rounded font-semibold ${getIKPAColor(
                          group.parent.nilai_ikpa
                        )}`}
                      >
                        {group.parent.nilai_ikpa}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {moment(group.parent.tanggal_sumber_data).format(
                        "YYYY/MM/DD"
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {/* Row anak (satker) */}
                {group.children.map((row, idx) => (
                  <TableRow key={row.id}>
                    {/* <TableCell align="center">{row.satker_code}</TableCell> */}
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.revisi_dipa}</TableCell>
                    <TableCell align="center">
                      {row.deviasi_hal3_dipa}
                    </TableCell>
                    <TableCell align="center">
                      {row.realisasi_anggaran}
                    </TableCell>
                    <TableCell align="center">
                      {row.belanja_kontraktual}
                    </TableCell>
                    <TableCell align="center">
                      {row.penyelesaian_tagihan}
                    </TableCell>
                    <TableCell align="center">
                      {row.pengelolaan_up_tup}
                    </TableCell>
                    <TableCell align="center">{row.dispensasi_spm}</TableCell>
                    <TableCell align="center">{row.capaian_output}</TableCell>
                    <TableCell align="center">
                      <div
                        className={`p-1 rounded font-semibold ${getIKPAColor(
                          row.nilai_ikpa
                        )}`}
                      >
                        {row.nilai_ikpa}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.tanggal_sumber_data).format("YYYY/MM/DD")}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
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
