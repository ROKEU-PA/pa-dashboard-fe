import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Modal from "@/components/Modal";
import themeColors from "@/constants/color";
import Input from "@/components/Input";
import Button from "@/components/Button";
import TableSortLabel from "@/components/TableSortLabel";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import { Download, Upload } from "lucide-react";
import { fetchHelperGET } from "@/services/FetchHelper";
import { toast } from "react-toastify";
import FileInput from "@/components/FileInput";

const columns = [
  { key: "kode_satker", label: "Kode Satker" },
  { key: "eselon", label: "Eselon 1/Satker" },
  { key: "revisi_dipa", label: "Revisi DIPA" },
  { key: "deviasi_hal3_dipa", label: "Deviasi Hal III Dipa" },
  { key: "realisasi_anggaran", label: "Realisasi Anggaran" },
  { key: "belanja_kontraktual", label: "Belanja Kontraktual" },
  { key: "penyelesaian_tagihan", label: "Penyelesaian Tagihan" },
  { key: "pengelolaan_up_tup", label: "Pengelolaan UP TUP" },
  { key: "capaian_output", label: "Capaian Output" },
  { key: "nilai_ikpa", label: "Nilai IKPA" },
  { key: "tanggal_sumber_data", label: "Tanggal Sumber Data" },
];

function IkpaPage() {
  const { userData } = useContext(AppContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [filter, setFilter] = useState({
    searchKey: "",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

  const handleDateChange = (key, value) => {
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };

      if (
        key === "startDate" &&
        newFilter.endDate &&
        value > newFilter.endDate
      ) {
        newFilter.endDate = null;
      }

      return newFilter;
    });
  };

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
        biro_code: userData?.biro_code,
        year: filter.year,
        search_key: filter.searchKey,
        page: page + 1,
        per_page: rowsPerPage,
        sort_by: sortBy,
        sort_dir: sortDir,
        start_date: filter.startDate
          ? moment(filter.startDate).format("YYYY-MM-DD").toString()
          : "",
        end_date: filter.endDate
          ? moment(filter.endDate).format("YYYY-MM-DD").toString()
          : "",
      });
      const data = await apiRequest({
        url: `/api/pa/ikpa/all?`,
      });
      let result = data?.data;
      console.log(result);
      if (data.success) {
        setTotalPages(result?.last_page);
        setDataTable(result?.data);
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
  }, [
    filter.year,
    filter.searchKey,
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Soon", path: "/soon" }]} />
      <Title>Fitur Sedang Di Kembangkan </Title>
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
            onChange={(e) => handleDateChange("searchKey", e.target.value)}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              onClick={() => setIsOpenModal(true)}
              style={{ width: "fit-content" }}
              variant="secondary"
              icon={<Upload size={20} />}
            >
              Import Data IKPA
            </Button>
            <Button
              onClick={fetchTemplateDownload}
              style={{ width: "fit-content" }}
              variant="primary"
              icon={<Download size={20} />}
            >
              Download Template
            </Button>
          </div>
          {/* <Input
            label="Tahun"
            style={{ width: "200px" }}
            name="Tahun"
            value={filter.year}
            validate={validationSchema.tahun}
            onChange={(e) => handleDateChange("year", e.target.value)}
          /> 
          <DatePickerInput
            label="Start Date"
            selected={filter.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            selectsStart
            startDate={filter.startDate}
            endDate={filter.endDate}
          />
          <DatePickerInput
            label="End Date"
            selected={filter.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            selectsEnd
            startDate={filter.startDate}
            endDate={filter.endDate}
            minDate={filter.startDate}
          /> */}
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
                  onClick={() => col.sortable && handleSortChange(col.key)}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortDir}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          {/* <TableBody>
            {dataTable.map((row) => (
              <TableRow
                key={row.no}
                sx={{
                  "&:lastChild td, &:lastChild th": { borderBottom: "none" },
                }}
              >
                <TableCell align="center">1</TableCell>
                <TableCell align="center">Sekretariat Jenderal</TableCell>
                <TableCell align="center">{row?.["revisi_dipa"]}</TableCell>
                <TableCell align="center">
                  {row?.["deviasi_hal3_dipa"]}
                </TableCell>
                <TableCell align="center">
                  {row?.["realisasi_anggaran"]}
                </TableCell>
                <TableCell align="center">
                  {row?.["belanja_kontraktual"]}
                </TableCell>
                <TableCell align="center">
                  {row?.["penyelesaian_tagihan"]}
                </TableCell>
                <TableCell align="center">
                  {row?.["pengelolaan_up_tup"]}
                </TableCell>
                <TableCell align="center">{row?.["capaian_output"]}</TableCell>
                <TableCell align="center">{row?.["nilai_ikpa"]}</TableCell>
                <TableCell align="center">
                  {moment(row?.["updated_at"]).format("YYYY/MM/DD")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}
          <TableBody>
            {Object.entries(groupedData).map(([eselonCode, group], index) => (
              <React.Fragment key={eselonCode}>
                {/* Row utama (group) */}
                {group.parent && (
                  <TableRow
                    sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
                  >
                    <TableCell align="center">{group.parent.eselon_code}</TableCell>
                    <TableCell align="center">
                      {group.parent.name}
                    </TableCell>
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
                      {group.parent.nilai_ikpa}
                    </TableCell>
                    <TableCell align="center">
                      {moment(group.parent.updated_at).format("YYYY/MM/DD")}
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
                    <TableCell align="center">{row.capaian_output}</TableCell>
                    <TableCell align="center">{row.nilai_ikpa}</TableCell>
                    <TableCell align="center">
                      {moment(row.updated_at).format("YYYY/MM/DD")}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setPage(0); // reset to first page when rows per page changes
          }}
        />
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
