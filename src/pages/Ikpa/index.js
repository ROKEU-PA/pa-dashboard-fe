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

const columns = [
  { key: "kode_satker", label: "Kode Satker" },
  { key: "eselon", label: "Eselon 1/Satker" },
  { key: "revisi_dipa", label: "Revisi DIPA" },
  { key: "deviasi_hal3_dipa", label: "Deviasi Hal III Dipa" },
  { key: "realisasi_anggaran", label: "Realisasi Anggaran" },
  { key: "belanja_kontraktual", label: "Belanja Kontraktual" },
  { key: "penyelesaian_tagihan", label: "Penyelesaian Tagihan" },
  { key: "pengelolaan_up_tup", label: "Pengelolaan UP TUP" },
  { key: "dispensasi_spm", label: "Dispensasi SPM" },
  { key: "capaian_output", label: "Capaian Output" },
  { key: "nilai_ikpa", label: "Nilai IKPA" },
  { key: "tanggal_sumber_data", label: "Tanggal Sumber Data" },
];

function IkpaPage() {
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [es1Data, setEs1Data] = useState([]);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });

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
      if (data.success) {
        setEs1Data(result);
      }
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

  const groupedData = dataTable.reduce((acc, row) => {
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
        <Breadcrumbs items={[{ name: "Soon", path: "/soon" }]} />
        <User
          name={userData?.name}
          previlege={userData?.role?.toUpperCase()}
          username={userData?.biro_code}
          role={userData?.role}
          access_code={userData?.access_code}
          id={userData?.id}
        />
      </div>
      <Title>Indikator Pelaksanaan Anggaran Tingkat Satuan Kerja</Title>
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
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                >
                  {col.label}
                </TableCell>
              ))}
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
                    <TableCell align="center">
                      {group.parent.eselon_code}
                    </TableCell>
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
                      {group.parent.nilai_ikpa}
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
                    <TableCell align="center">{row.satker_code}</TableCell>
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
                    <TableCell align="center">{row.nilai_ikpa}</TableCell>
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

export default IkpaPage;
