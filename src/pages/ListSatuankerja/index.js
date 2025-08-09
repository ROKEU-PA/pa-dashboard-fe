import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Plus } from "lucide-react";
import FileInput from "@/components/FileInput";
import {
  buildQueryString,
  formatUrlPathToTitle,
  validationSchema,
} from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import DatePickerInput from "@/components/DatePickerInput";
// import CustomPDFViewer from "@/components/PDFViewer";
import themeColors from "@/constants/color";
import TableSortLabel from "@/components/TableSortLabel";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import {
  columns,
  getCurrentSatuanKerja,
  isPengajuanPath,
} from "@/pages/ListSatuankerja/satkerHooks";

function ListSatuanKerjaPage() {
  const { menuName, listMenu } = useContext(AppContext);
  const location = useLocation();

  const [currentMenu, setCurrentMenu] = useState(
    getCurrentSatuanKerja(listMenu, location.pathname)
  );
  const menuTitle = formatUrlPathToTitle(location.pathname);
  const [filter, setFilter] = useState({
    tahun: "",
    searchKey: "",
    startDate: null,
    endDate: null,
  });
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [variantModal, setVariantModal] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    no_spp: "",
    tahun: "",
    type: "",
    dokumen: null,
    keterangan: "",
  });
  const [dataTable, setDataTable] = useState([]);
  const [pdfToOpen, setPDFtoOpen] = useState("");

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const fetchTable = async () => {
    try {
      const now = isPengajuanPath(location.pathname)
        ? new Date().getFullYear()
        : filter.tahun;
      const query = buildQueryString({
        biro_code: currentMenu?.code,
        tahun: now,
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
      const data = await apiRequest({ url: `/api/archive/list?${query}` });
      let result = data.data;
      if (data.success) {
        setTotalPages(result?.last_page);
        setDataTable(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitData = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("keterangan", formData.keterangan);
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("dokumen", formData.dokumen);

      const result = await apiRequest({
        url: "/api/archive/create",
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

  const editData = async (formData) => {
    try {
      console.log(formData, currentMenu?.code);
      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("keterangan", formData.keterangan);
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("dokumen", formData.dokumen || formData.document);

      const result = await apiRequest({
        url: `/api/archive/edit/${formData?.id}`,
        method: "POST",
        options: {
          body: payload,
        },
        isMultiType: true,
      });
      console.log("editData", formData.id, result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    let isAnyFile = formData?.dokumen || formData?.document;

    try {
      if (variantModal === "Add" && isAnyFile) {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.dokumen ||
          !formData.keterangan
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.keterangan
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }
      if (variantModal === "Add") {
        submitData(formData);
      } else {
        editData(formData);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil disimpan!");
      setIsOpenModal(false);
      setFormData({
        no_spp: "",
        tahun: "",
        type: "",
        dokumen: null,
        keterangan: "",
      });
      fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchTable();
  }, [
    filter.tahun,
    filter.searchKey,
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
  ]);

  useEffect(() => {
    setCurrentMenu(getCurrentSatuanKerja(listMenu, location.pathname));
  }, [listMenu]);

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Satuan Kerja", path: "/satuan-kerja" },
          { name: menuName.name },
        ]}
      />
      <Title>{menuName.name || menuTitle}</Title>
      <Paper
        elevation={3}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {!isPengajuanPath(location.pathname) ? (
            <Button
              onClick={() => {
                setIsOpenModal(true);
                setFormData((prev) => ({ ...prev, tahun: moment().year() }));
                setVariantModal("Add");
              }}
              style={{ width: "fit-content" }}
              variant="danger"
              icon={<Plus size={20} />}
            >
              Tambah Arsip
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsOpenModal(true);
                setFormData((prev) => ({ ...prev, tahun: moment().year() }));
                setVariantModal("Add-Pengajuan");
              }}
              style={{ width: "fit-content" }}
              variant="danger"
              icon={<Plus size={20} />}
            >
              Tambah Pengajuan
            </Button>
          )}
          <div
            style={{
              width: "calc(100vw/2.2)",
              display: "flex",
              gap: 15,
              justifyContent: "right",
            }}
          >
            <Input
              label="Search"
              style={{ width: "200px" }}
              name="Search"
              value={filter.searchKey}
              onChange={(e) => handleDateChange("searchKey", e.target.value)}
            />
            {!isPengajuanPath(location.pathname) ? (
              <Input
                label="Tahun"
                style={{ width: "200px" }}
                name="Tahun"
                value={filter.tahun}
                validate={validationSchema.tahun}
                onChange={(e) => handleDateChange("tahun", e.target.value)}
              />
            ) : null}
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
            />
          </div>
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columns
                .filter(
                  (col) =>
                    !(col.hiddenInArsip && !isPengajuanPath(location.pathname))
                )
                .map((col) => (
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
          <TableBody>
            {dataTable.map((row, index) => (
              <TableRow key={index}>
                {columns
                  .filter(
                    (col) =>
                      !(
                        col.hiddenInArsip && !isPengajuanPath(location.pathname)
                      )
                  )
                  .map((col) => {
                    if (col.key == "spp_number") {
                      return (
                        <TableCell key={col.key} align="center">
                          {row?.['no_spp']}
                        </TableCell>
                      );
                    }
                    if (col.key === "created_at") {
                      return (
                        <TableCell key={col.key} align="center">
                          {moment(row?.[col.key]).format("YYYY/MM/DD")}
                        </TableCell>
                      );
                    }
                    if (col.key === "keterangan") {
                      return (
                        <TableCell key={col.key} align="center">
                          Revisi ke-{row?.[col.key]}
                        </TableCell>
                      );
                    }

                    if (col.key === "document") {
                      return (
                        <TableCell
                          key={col.key}
                          align="center"
                          onClick={() => {
                            if (typeof row.document?.url === "string") {
                              setIsOpenPDF(true);
                              setPDFtoOpen(row.document?.url);
                            }
                          }}
                          style={{
                            color: themeColors.primary.light,
                            cursor:
                              typeof row.document?.url === "string"
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {row.document?.filename || "-"}
                        </TableCell>
                      );
                    }

                    if (col.key === "action") {
                      return (
                        <TableCell key={col.key} align="center">
                          <Button
                            onClick={() => {
                              isPengajuanPath(location.pathname)
                                ? setVariantModal("Checklist")
                                : setVariantModal("Edit");
                              setFormData({
                                ...row,
                                type: row.jenis_spp,
                              });
                              setIsOpenModal(true);
                            }}
                            style={{ width: "fit-content" }}
                          >
                            {isPengajuanPath(location.pathname)
                              ? "Checklist"
                              : "Edit"}
                          </Button>
                        </TableCell>
                      );
                    }

                    // Default rendering
                    return (
                      <TableCell key={col.key} align="center">
                        {row[col.key] ?? "-"}
                      </TableCell>
                    );
                  })}
              </TableRow>
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
          setVariantModal("");
          setFormData({
            no_spp: "",
            tahun: "",
            type: "",
            dokumen: null,
            keterangan: "",
          });
        }}
        title="Form Pengarsipan"
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
          <Input
            label="No. SPP"
            name="no_spp"
            value={formData?.["no_spp"]}
            onChange={handleChange}
            required
            validate={validationSchema.onlyNumber}
            placeholder="Masukkan nomor SPP"
          />
          <Input
            label="Tahun"
            name="tahun"
            value={formData?.tahun}
            onChange={handleChange}
            validate={validationSchema.tahun}
            required
            placeholder="Masukkan tahun"
          />
          <Select
            label="Jenis SPP"
            name="type"
            value={formData?.type}
            onChange={handleChange}
            required
            options={[
              { label: "GUP", value: "GUP" },
              { label: "TUP", value: "TUP" },
              { label: "LS", value: "LS" },
            ]}
          />
          <FileInput
            accept=".pdf"
            label="Dokumen"
            name="dokumen"
            onChange={handleChange}
            required
            value={formData?.document}
          />
          <Textarea
            label="Uraian SPP"
            name="keterangan"
            value={formData?.keterangan}
            required
            onChange={handleChange}
            placeholder="Masukkan uraian tambahan"
            rows={5}
          />
          <Button type="submit" style={{ float: "right" }}>
            Submit
          </Button>
        </form>
      </Modal>
      <Modal open={isOpenPDF} onClose={() => setIsOpenPDF(false)} title="">
        {/* <CustomPDFViewer pdfSource="/pdf-tester.pdf" /> */}
        {/* <CustomPDFViewer pdfSource={pdfToOpen} /> */}
        {/* <CustomPDFViewer pdfSource="https://rokeubmn.kemnaker.go.id/storage/documents/BrQcOw5eryN4Y8q2CRHWtBZ1gDreuhdAXXoBenI8.pdf" /> */}
        {/* <iframe
          src={`https://rokeubmn.kemnaker.go.id/storage/documents/BrQcOw5eryN4Y8q2CRHWtBZ1gDreuhdAXXoBenI8.pdf`}
          style={{ width: "100%", height: "500px" }}
          title="PDF Viewer"
        /> */}
        <iframe
          src={pdfToOpen}
          style={{ width: "100%", height: "500px" }}
          title="PDF Viewer"
        />
      </Modal>
    </div>
  );
}

export default ListSatuanKerjaPage;
