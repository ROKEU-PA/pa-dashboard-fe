import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Paper from "@/components/Paper";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import { Book, Plus } from "lucide-react";
import FileInput from "@/components/FileInput";
import { buildQueryString, validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import DatePickerInput from "@/components/DatePickerInput";
import CustomPDFViewer from "@/components/PDFViewer";
import themeColors from "@/constants/color";
import TableSortLabel from "@/components/TableSortLabel";
import { AppContext } from "@/contexts/AppContext";
import { apiRequest } from "@/services/APIHelper";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  columns,
  getCurrentSatuanKerja,
  isPengajuanPath,
} from "@/pages/ListSatuankerja/satkerHooks";
import PendingDocumentsModal from "./pendingDocumentsModal";
import {
  statusColorClass,
  statusColorText,
  statusLabel,
} from "./constants/styleConstants";
import ChecklistComponent from "./components/ChecklistComponent";

function ListSatuanKerjaPage() {
  const { listMenu, userData } = useContext(AppContext);
  const location = useLocation();

  const [currentMenu, setCurrentMenu] = useState(
    getCurrentSatuanKerja(listMenu, location.pathname),
  );
  const [filter, setFilter] = useState({
    tahun: "",
    searchKey: "",
    startDate: null,
    endDate: null,
  });
  const [isOpenPDF, setIsOpenPDF] = useState(false);
  const [letiantModal, setVariantModal] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCheckModal, setIsCheckModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [types, setTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [formData, setFormData] = useState({
    no_spp: "",
    tahun: "",
    type: "",
    type_id: "",
    dokumen: null,
    dokumen_spm: null,
    dokumen_sp2d: null,
    uploaded_by: "",
    status: "",
    kelengkapan: [],
    catatan: "",
    verifikasi: [],
    is_edit: null,
    link: "",
    jml_hal: 0,
  });
  const [dataTable, setDataTable] = useState([]);
  const [pdfToOpen, setPDFtoOpen] = useState("");
  const [multiSelectOneOpen, setMultiSelectOneOpen] = useState(false);
  const [multiSelectTwoOpen, setMultiSelectTwoOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState(false);
  const [selectOpenJenis, setSelectOpenJenis] = useState(false);
  const [jenisFile, setJenisFile] = useState("file");
  const [showModal, setShowModal] = useState(true);

  const auth = sessionStorage.getItem("auth");
  const accessToken = JSON.parse(auth)?.accessToken;

  const getFileExtension = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname;

      if (
        hostname.includes("drive.google.com") ||
        hostname.includes("docs.google.com") ||
        hostname.includes("drive.googleusercontent.com")
      ) {
        return "gdrive";
      }

      const parts = pathname.split(".");
      if (parts.length > 1) {
        return parts.pop().toLowerCase();
      }

      return "";
    } catch {
      return "";
    }
  };

  const fileExtension = getFileExtension(pdfToOpen);

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

  const getAcceptedFileType = () => ".pdf,.PDF,.rar,.RAR,.zip,.ZIP";

  const isFileSizeValid = (file, maxSizeMB = 100) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const fetchType = async (id) => {
    try {
      if (id) {
        const data = await apiRequest({ url: `/pa/spp/type?id=` + id });
        const verif = await apiRequest({
          url: `/pa/spp/type?id=verifikasi`,
        });
        let result = data.data;
        let resultVerif = verif.data;
        if (data.success) {
          setQuestions(result[0].questions);
          setVerifications(resultVerif[0].questions);
        }
      } else {
        const data = await apiRequest({ url: `/pa/spp/type?id=` });
        let result = data.data;
        if (data.success) {
          const filteredResult = result.filter(
            (item) => item.type_id !== "verifikasi",
          );
          setTypes(filteredResult);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTable = async () => {
    try {
      const now = isPengajuanPath(location.pathname)
        ? new Date().getFullYear()
        : filter.tahun;
      const status = isPengajuanPath(location.pathname) ? "arsip" : null;
      const query = buildQueryString({
        biro_code: currentMenu?.code,
        tahun: now,
        status: status,
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
        url: `/archive/list?${query}`,
        token: accessToken,
      });
      let result = data?.data;
      if (data?.success) {
        setTotalPages(result?.last_page);
        setDataTable(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitData = async (formData) => {
    try {
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formData.link,
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();

      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("dokumen", formData.dokumen);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", formData.jml_hal);
      payload.append("feedback", formData.catatan ?? formData.feedback);
      if (!isPengajuanPath(location.pathname)) {
        payload.append("status", "arsip");
      }
      payload.append("uploaded_name", formData.uploaded_by);

      if (formData.dokumen !== null) {
        const defaultToken = localStorage.getItem("token");
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const toastId = toast.info("Uploading file...", {
            progress: 0,
            autoClose: false,
            closeButton: false,
            isLoading: true,
          });
          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              toast.update(toastId, {
                render: `Uploading file... (${percent}%)`,
                progress: percent / 100,
              });
            }
          };
          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 201) {
              toast.update(toastId, {
                render: "File berhasil diupload!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              resolve(xhr.response); // ✅ sukses → Promise resolve
            } else {
              toast.update(toastId, {
                render: "Upload gagal. Silakan coba lagi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
              reject(new Error("Upload gagal"));
            }
          };
          xhr.onerror = function () {
            toast.update(toastId, {
              render: "Terjadi kesalahan jaringan.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
            reject(new Error("Network error"));
          };
          xhr.open(
            "POST",
            `${process.env.REACT_APP_API_BASE_URL}/archive/create`,
          );
          xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
          xhr.send(payload);
        });
      } else {
        const result = await apiRequest({
          url: "/archive/create",
          method: "POST",
          options: {
            body: payload,
          },
          isMultiType: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
    }
  };

  const editData = async (formData) => {
    try {
      const payload = new FormData();
      let CryptoJS = require("crypto-js");
      let encryptedLink = CryptoJS.AES.encrypt(
        formData.link,
        "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk",
      ).toString();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("feedback", formData.catatan ?? formData.feedback);
      payload.append("status", formData.status);
      payload.append("questions", JSON.stringify(formData.kelengkapan));
      payload.append("verifications", JSON.stringify(formData.verifikasi));
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("link", encryptedLink);
      payload.append("jml_hal", formData.jml_hal);
      payload.append("is_edit", letiantModal === "Edit" ? "true" : "false");

      const hasFileUpload =
        formData.dokumen instanceof File ||
        formData.dokumen_spm instanceof File ||
        formData.dokumen_sp2d instanceof File;

      if (formData.dokumen instanceof File) {
        payload.append("dokumen", formData.dokumen || formData.document);
      }

      if (formData.dokumen_spm instanceof File) {
        payload.append("dokumen_spm", formData.dokumen_spm);
      }

      if (formData.dokumen_sp2d instanceof File) {
        payload.append("dokumen_sp2d", formData.dokumen_sp2d);
      }

      const defaultToken = localStorage.getItem("token");

      if (hasFileUpload) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          const toastId = toast.info("Uploading file...", {
            progress: 0,
            autoClose: false,
            closeButton: false,
            isLoading: true,
          });

          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              toast.update(toastId, {
                render: `Uploading file... (${percent}%)`,
                progress: percent / 100,
              });
            }
          };

          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 201) {
              toast.update(toastId, {
                render: "File berhasil diupload!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              resolve(xhr.response); // ✅ sukses → Promise resolve
            } else {
              toast.update(toastId, {
                render: "Upload gagal. Silakan coba lagi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
              reject(new Error("Upload gagal"));
            }
          };

          xhr.onerror = function () {
            toast.update(toastId, {
              render: "Terjadi kesalahan jaringan.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
            reject(new Error("Network error"));
          };

          xhr.open(
            "POST",
            `${process.env.REACT_APP_API_BASE_URL}/archive/edit/${formData?.id}`,
          );
          xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
          xhr.send(payload);
        });
      } else {
        const result = await apiRequest({
          url: `/archive/edit/${formData?.id}`,
          method: "POST",
          options: {
            body: payload,
          },
          isMultiType: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
    }
  };

  const checklistIsValid = () => {
    if (formData.status === "approved" && isPengajuanPath(location.pathname)) {
      const kelengkapanChecked = formData.kelengkapan.map((item) => item.value);
      const verifikasiChecked = formData.verifikasi.map((item) => item.value);

      const allKelengkapanChecked = questions.every((q) =>
        kelengkapanChecked.includes(q.id_question),
      );

      const allVerifikasiChecked = verifications.every((v) =>
        verifikasiChecked.includes(v.id_question),
      );

      return allKelengkapanChecked && allVerifikasiChecked;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isAnyFile = formData?.dokumen || formData?.document;
    formData.type = formData.type_id;
    try {
      if (
        letiantModal === "Add" &&
        isAnyFile &&
        isPengajuanPath(location.pathname)
      ) {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.uploaded_by ||
          !formData.dokumen
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (
        letiantModal === "Add" &&
        isAnyFile &&
        !isPengajuanPath(location.pathname)
      ) {
        if (
          !formData?.["no_spp"] ||
          !formData.tahun ||
          !formData.type ||
          !formData.dokumen
        ) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (letiantModal === "Edit") {
        if (!formData?.["no_spp"] || !formData.tahun || !formData.type) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (letiantModal === "Pengujian") {
        if (!formData.kelengkapan || !formData.status || !formData.verifikasi) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }

      if (isAnyFile && formData.dokumen) {
        const file = formData.dokumen;
        const acceptedExtension = getAcceptedFileType()
          .replace(/\s+/g, "")
          .split(",");

        const fileName = file.name?.toLowerCase();
        const isAccepted = acceptedExtension.some((ext) =>
          fileName.endsWith(ext),
        );

        if (!isAccepted) {
          toast.error(
            `File yang diizinkan hanya: ${acceptedExtension.join(", ")}`,
          );
          return;
        }

        const maxSize =
          formData.type_id === "ptup" ||
          formData.type_id === "gup" ||
          formData.type_id === "uptup" ||
          formData.type_id === "gup_kkp" ||
          formData.type_id === "gup_pnbp" ||
          formData.type_id === "gup_rm" ||
          formData.type_id === "ptup_rm" ||
          formData.type_id === "ptup_pnbp"
            ? 1536
            : 200;

        if (!isFileSizeValid(file, maxSize)) {
          toast.error("Ukuran file melebihi " + maxSize + "MB");
          return;
        }
      }

      if (!checklistIsValid()) {
        toast.error(
          "Semua Kelengkapan dan Verifikasi harus dicentang sebelum status dirubah Telah Diuji.",
        );
        return;
      }
      if (letiantModal === "Add") {
        await submitData(formData);
      } else {
        await editData(formData);
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil disimpan!");
      setIsOpenModal(false);
      setIsCheckModal(false);
      setFormData({
        no_spp: "",
        tahun: "",
        type: "",
        type_id: "",
        dokumen: null,
        uploaded_by: "",
        kelengkapan: [],
        catatan: "",
        verifikasi: [],
        link: "",
        jml_hal: "",
      });
      fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchTable();
    fetchType();
    setCurrentMenu(getCurrentSatuanKerja(listMenu, location.pathname));
  }, [
    filter.tahun,
    filter.searchKey,
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
    listMenu,
  ]);

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div
          className="mb-4"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {userData &&
            (!isPengajuanPath(location.pathname) ? (
              <Button
                onClick={() => {
                  setIsOpenModal(true);
                  setFormData((prev) => ({
                    ...prev,
                    tahun: moment().year(),
                  }));
                  setVariantModal("Add");
                }}
                style={{ width: "fit-content" }}
                letiant="danger"
                icon={<Plus size={20} />}
              >
                Tambah Arsip
              </Button>
            ) : (
              userData?.role === "user" && (
                <Button
                  onClick={() => {
                    setIsOpenModal(true);
                    setFormData((prev) => ({
                      ...prev,
                      tahun: moment().year(),
                    }));
                    setVariantModal("Add");
                  }}
                  letiant="danger"
                  icon={<Plus size={20} />}
                >
                  Tambah Pengajuan
                </Button>
              )
            ))}

          {/* Kolom Kanan: Form Filter */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "center",
            }}
          >
            <a
              href={
                "https://drive.google.com/file/d/1t2_URZ7ij2rciW-tmNDIDyRFhdwiZ10f/view"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                style={{ width: "fit-content" }}
                letiant="secondary"
                icon={<Book size={20} />}
              >
                PMK 039 2024
              </Button>
            </a>
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
        {/* c */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHeader>
              <TableRow>
                {columns
                  .filter(
                    (col) =>
                      !(
                        col.hiddenInArsip && !isPengajuanPath(location.pathname)
                      ),
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
                          col.hiddenInArsip &&
                          !isPengajuanPath(location.pathname)
                        ),
                    )
                    .map((col) => {
                      if (col.key == "spp_number") {
                        return (
                          <TableCell key={col.key} align="center">
                            {row?.["no_spp"]}
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
                      if (col.key === "revisi") {
                        return (
                          <TableCell key={col.key} align="center">
                            Revisi ke-{row?.[col.key]}
                          </TableCell>
                        );
                      }
                      if (col.key === "status") {
                        return (
                          <TableCell key={col.key} align="center">
                            <div
                              className={`${statusColorClass(row?.[col.key])} rounded-lg p-1`}
                            >
                              <span
                                className={`px-2 py-1 rounded text-sm whitespace-nowrap ${statusColorText(row?.[col.key])}`}
                              >
                                {statusLabel(row?.[col.key])}
                              </span>
                            </div>
                          </TableCell>
                        );
                      }

                      if (col.key === "catatan") {
                        return (
                          <TableCell key={col.key} align="center">
                            {row?.["feedback"] == "null" ||
                            row?.["feedback"] == null ? (
                              "-"
                            ) : row?.["feedback"].length > 25 ? (
                              <span
                                className={`px-2 py-1 rounded text-white text-sm bg-yellow-500`}
                              >
                                {"...Catatan lengkap di Detail"}
                              </span>
                            ) : (
                              row?.["feedback"]
                            )}
                          </TableCell>
                        );
                      }

                      if (col.key == "kelengkapan") {
                        return (
                          <TableCell key={col.key} align="center">
                            {row?.["total_kelengkapan"]}
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
                            {`Klik untuk lihat SPP ` + row.no_spp || "-"}
                          </TableCell>
                        );
                      }

                      if (col.key === "document_spm") {
                        return (
                          <TableCell
                            key={col.key}
                            align="center"
                            onClick={() => {
                              if (typeof row.document_spm?.url === "string") {
                                setIsOpenPDF(true);
                                setPDFtoOpen(row.document_spm?.url);
                              }
                            }}
                            style={{
                              color: themeColors.primary.light,
                              cursor:
                                typeof row.document_spm?.url === "string"
                                  ? "pointer"
                                  : "default",
                            }}
                          >
                            {typeof row.document_spm?.url === "string"
                              ? `Klik untuk lihat SPM ` + row.no_spp || "-"
                              : "-"}
                          </TableCell>
                        );
                      }

                      if (col.key === "document_sp2d") {
                        return (
                          <TableCell
                            key={col.key}
                            align="center"
                            onClick={() => {
                              if (typeof row.document_sp2d?.url === "string") {
                                setIsOpenPDF(true);
                                setPDFtoOpen(row.document_sp2d?.url);
                              }
                            }}
                            style={{
                              color: themeColors.primary.light,
                              cursor:
                                typeof row.document_sp2d?.url === "string"
                                  ? "pointer"
                                  : "default",
                            }}
                          >
                            {typeof row.document_sp2d?.url === "string"
                              ? `Klik untuk lihat SP2D ` + row.no_spp || "-"
                              : "-"}
                          </TableCell>
                        );
                      }

                      if (col.key === "jml_hal") {
                        return (
                          <TableCell key={col.key} align="center">
                            {typeof row.jml_hal !== "undefined" ||
                            row.jml_hal !== null ||
                            row.jml_hal === 0
                              ? "-"
                              : row.jml_hal}
                          </TableCell>
                        );
                      }

                      if (col.key === "action") {
                        const isPengajuan = isPengajuanPath(location.pathname);
                        const role = userData?.role;

                        const showEditButton =
                          (isPengajuan &&
                            role === "user" &&
                            row.status !== "approved" &&
                            row.status !== "sp2d") ||
                          !isPengajuan;

                        const showPengujianButton =
                          isPengajuan &&
                          (role === "admin" || role === "pic") &&
                          row.status !== "sp2d";

                        const showDetailButton =
                          isPengajuan &&
                          (row.status === "approved" ||
                            row.status === "reject" ||
                            row.status === "sp2d");

                        const showDash = false;

                        return (
                          <TableCell
                            key={col.key}
                            align="center"
                            className="flex flex-col gap-2"
                          >
                            {showEditButton && (
                              <div
                                className="bg-blue-400 p-3 rounded-lg text-white cursor-pointer hover:bg-blue-500 active:bg-blue-600 w-full"
                                onClick={() => {
                                  if (
                                    row.document.filename.includes("file_drive")
                                  ) {
                                    setJenisFile("link");
                                  } else {
                                    setJenisFile("file");
                                  }
                                  setVariantModal("Edit");
                                  setFormData({
                                    ...row,
                                    type: row.jenis_spp,
                                    link: row.document.path,
                                  });
                                  setIsOpenModal(true);
                                }}
                              >
                                Edit
                              </div>
                            )}

                            {showPengujianButton && (
                              <div
                                className="bg-orange-400 p-3 rounded-lg text-white cursor-pointer hover:bg-orange-500 active:bg-orange-600 w-full whitespace-nowrap"
                                onClick={() => {
                                  const kelengkapanWithLabel = questions
                                    .filter((q) =>
                                      row.question_checklist?.includes(
                                        q.id_question,
                                      ),
                                    )
                                    .map((q) => ({
                                      label: q.text,
                                      value: q.id_question,
                                    }));

                                  const verifikasiWithLabel = verifications
                                    .filter((v) =>
                                      row.verification_checklist?.includes(
                                        v.id_question,
                                      ),
                                    )
                                    .map((v) => ({
                                      label: v.text,
                                      value: v.id_question,
                                    }));
                                  setVariantModal("Pengujian");
                                  setFormData({
                                    ...row,
                                    type: row.jenis_spp,
                                    kelengkapan: kelengkapanWithLabel,
                                    verifikasi: verifikasiWithLabel,
                                    catatan: row.feedback,
                                  });
                                  fetchType(row.type_id);
                                  setPDFtoOpen(row.document?.url);
                                  setIsCheckModal(true);
                                }}
                                letiant="danger"
                              >
                                {row.status === "approved"
                                  ? "Ubah Status"
                                  : "Pengujian"}
                              </div>
                            )}

                            {showDetailButton && (
                              <div
                                className="bg-[#BCDD51] p-3 rounded-lg text-white cursor-pointer hover:bg-[#A2C827] active:bg-[#b2d836] w-full"
                                onClick={() => {
                                  fetchType(row.type_id);
                                  setFormData({
                                    ...row,
                                    type: row.jenis_spp,
                                    kelengkapan: row.question_checklist,
                                    verifikasi: row.verification_checklist,
                                  });
                                  setIsDetailModal(true);
                                }}
                              >
                                Detail
                              </div>
                            )}

                            {showDash && <>-</>}
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
        </div>
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
            type_id: "",
            dokumen: null,
            uploaded_by: "",
            catatan: "",
          });
        }}
        title={
          isPengajuanPath(location.pathname)
            ? letiantModal == "Add"
              ? "Form Pengajuan"
              : "Form Edit"
            : "Form Pengarsipan"
        }
      >
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 10,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            height: "450px",
            overflowY: "auto",
          }}
        >
          <Input
            label="No. SPP"
            name="no_spp"
            value={formData?.no_spp}
            onChange={handleChange}
            required
            validate={(val) => {
              const onlyNumberError = validationSchema.onlyNumber(val);
              if (onlyNumberError) return onlyNumberError;

              const numbersppError = validationSchema.numberspp(val);
              if (numbersppError) return numbersppError;

              return "";
            }}
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type_id: e.target.value,
              }))
            }
            value={formData?.type_id}
            options={types.map((q) => ({
              label: q.type,
              value: q.type_id,
            }))}
            isOpen={selectOpen}
            setIsOpen={(open) => {
              if (open) {
                setSelectOpenJenis(false);
              }
              setSelectOpen(open);
            }}
          />

          {/* Tampilkan Nama Pengirim hanya jika isPengajuanPath TRUE */}
          {isPengajuanPath(location.pathname) && letiantModal == "Add" && (
            <Input
              label="Nama Pengirim"
              name="uploaded_by"
              value={formData?.uploaded_by}
              onChange={handleChange}
              validate={validationSchema.name}
              required
              placeholder="Masukkan Nama"
            />
          )}

          {!isPengajuanPath(location.pathname) && letiantModal === "Add" && (
            <Select
              label="Jenis File"
              name="jenis_file"
              value={jenisFile}
              onChange={(selected) => {
                setJenisFile(selected.target.value);
              }}
              options={[
                { label: "File Upload", value: "file" },
                { label: "Link Drive", value: "link" },
              ]}
              isOpen={selectOpenJenis}
              setIsOpen={(open) => {
                if (open) {
                  setSelectOpen(false);
                }
                setSelectOpenJenis(open);
              }}
            />
          )}
          {jenisFile === "link" && (
            <Input
              label="Link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              validate={validationSchema.link}
              required
              placeholder="Masukkan Link"
            />
          )}

          {jenisFile === "link" && (
            <Input
              label="Jumlah halaman file"
              name="jml_hal"
              value={formData.jml_hal}
              onChange={handleChange}
              validate={validationSchema.onlyNumber}
              required
              placeholder="Masukkan Jumlah halaman file"
            />
          )}

          {jenisFile === "file" && (
            <FileInput
              accept={getAcceptedFileType()}
              label="Dokumen"
              name="dokumen"
              onChange={handleChange}
              required
              value={formData?.document}
            />
          )}

          {userData &&
            !isPengajuanPath(location.pathname) &&
            letiantModal == "Edit" &&
            userData?.role !== "user" && (
              <FileInput
                accept=".pdf"
                label="Dokumen SPM"
                name="dokumen_spm"
                onChange={handleChange}
                required
                value={formData?.document_spm}
              />
            )}

          {userData &&
            !isPengajuanPath(location.pathname) &&
            letiantModal == "Edit" &&
            userData?.role !== "user" && (
              <FileInput
                accept=".pdf"
                label="Dokumen SP2D"
                name="dokumen_sp2d"
                onChange={handleChange}
                required
                value={formData?.document_sp2d}
              />
            )}

          {/* Tampilkan Catatan hanya jika isPengajuanPath FALSE */}
          {!isPengajuanPath(location.pathname) && userData?.role === "pic" && (
            <Textarea
              label="Catatan"
              name="catatan"
              value={formData?.catatan ?? formData?.feedback ?? ""}
              onChange={handleChange}
            />
          )}

          <Button type="submit" style={{ float: "right" }}>
            Submit
          </Button>
        </form>
      </Modal>
      <Modal
        open={isOpenPDF}
        onClose={() => setIsOpenPDF(false)}
        title=""
        width={fileExtension === "pdf" ? "80vw" : "5vw"}
        maxWidth="95vw"
      >
        {fileExtension === "pdf" ? (
          <div
            style={{
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              padding: 0,
            }}
          >
            <CustomPDFViewer pdfSource={pdfToOpen} />
          </div>
        ) : fileExtension === "gdrive" ? (
          <a href={pdfToOpen} target="_blank" rel="noopener noreferrer">
            <p>File berupa link Google Drive</p>
            <br />
            <Button style={{ width: "100%" }}>Buka</Button>
          </a>
        ) : (
          <a href={pdfToOpen} download>
            <p>File SPP ber-format (.rar)</p>
            <br />
            <Button style={{ width: "100%" }}>Download File</Button>
          </a>
        )}
      </Modal>
      <Modal
        open={isCheckModal}
        onClose={() => {
          setIsCheckModal(false);
          setVariantModal("");
        }}
        title="Form Pengujian"
        width={fileExtension === "pdf" ? "95vw" : "80vw"}
        maxWidth="95vw"
        bodyStyle={{
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            padding: window.innerWidth <= 768 ? "2px" : "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 768 ? "column" : "row", // FIX
              gap: 20,
              width: "100%",
              padding: window.innerWidth <= 768 ? "0 2px" : 0,
              height: "auto",
              overflow: "auto",
            }}
          >
            {fileExtension === "pdf" ? (
              // <iframe
              //   src={`${pdfToOpen}#zoom=120`}
              //   style={{ width: "100%", height: "100%" }}
              //   title="PDF Viewer"
              // />
              <div
                style={{
                  width: window.innerWidth <= 768 ? "100%" : "50%",
                  maxHeight: window.innerWidth <= 768 ? "45vh" : "100%",
                  overflowY: "auto",
                  padding: 0,
                }}
              >
                <CustomPDFViewer pdfSource={pdfToOpen} />
              </div>
            ) : (
              <div style={{ width: window.innerWidth <= 768 ? "100%" : "50%" }}>
                <p>File SPP ber-format (.rar)</p>
                <br />
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    const linkSPP = document.createElement("a");
                    linkSPP.href = pdfToOpen;
                    linkSPP.download = "";
                    linkSPP.click();
                  }}
                >
                  Download File
                </Button>
              </div>
            )}
            <div
              style={{
                width: window.innerWidth <= 768 ? "100%" : "50%",
                maxHeight:
                  window.innerWidth <= 768 ? "auto" : "calc(100vh - 150px)",
                paddingRight: 10,
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: 20,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                }}
              >
                <Input
                  label="No. SPP"
                  name="no_spp"
                  value={formData?.["no_spp"]}
                  disabled
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  }}
                />
                <Select
                  label="Jenis SPP"
                  name="type"
                  value={formData?.type_id}
                  disabled
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  }}
                  options={types.map((q) => ({
                    label: q.type,
                    value: q.type_id,
                  }))}
                  isOpen={selectOpen}
                  setIsOpen={(open) => {
                    if (open) {
                      setSelectOpenStatus(false);
                    }
                    setSelectOpen(open);
                  }}
                />
                <ChecklistComponent
                  title="Kelengkapan"
                  items={questions.map((q) => ({
                    id: q.id_question,
                    label: q.text,
                  }))}
                  selectedIds={formData.kelengkapan}
                  onChange={(updated) =>
                    setFormData((prev) => ({
                      ...prev,
                      kelengkapan: updated,
                    }))
                  }
                  disabled={formData.status === "sp2d"}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  }}
                  options={[
                    { label: "Ditolak", value: "reject" },
                    { label: "Telah Diuji", value: "approved" },
                    { label: "SP2D", value: "sp2d" },
                  ]}
                  isOpen={selectOpenStatus}
                  setIsOpen={(open) => {
                    if (open) {
                      setMultiSelectOneOpen(false);
                      setMultiSelectTwoOpen(false);
                    }
                    setSelectOpenStatus(open);
                  }}
                />
                <ChecklistComponent
                  title="Verifikasi"
                  items={verifications.map((q) => ({
                    id: q.id_question,
                    label: q.text,
                  }))}
                  selectedIds={formData?.verifikasi}
                  onChange={(updated) =>
                    setFormData((prev) => ({
                      ...prev,
                      verifikasi: updated,
                    }))
                  }
                  disabled={formData.status === "sp2d"}
                />
                <Textarea
                  label="Catatan"
                  name="catatan"
                  value={formData?.catatan ?? formData?.feedback ?? ""}
                  onChange={handleChange}
                  style={{
                    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  }}
                />
                <Button type="submit" style={{ width: "100%" }}>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isDetailModal}
        onClose={() => {
          setIsDetailModal(false);
          setVariantModal("");
        }}
        title="Detail"
        style={{
          maxWidth: "600px",
          width: "90vw",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            padding: 20,
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <form
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
              disabled
            />
            <Select
              label="Jenis SPP"
              name="type"
              value={formData?.type_id}
              disabled
              options={types.map((q) => ({
                label: q.type,
                value: q.type_id,
              }))}
              isOpen={selectOpen}
              setIsOpen={(open) => {
                if (open) {
                  setSelectOpenStatus(false);
                }
                setSelectOpen(open);
              }}
            />

            <Select
              label="Status"
              name="status"
              value={formData?.status}
              onChange={handleChange}
              options={[
                { label: "Ditolak", value: "reject" },
                { label: "Telah Diuji", value: "approved" },
                { label: "SP2D", value: "sp2d" },
              ]}
              isOpen={selectOpenStatus}
              setIsOpen={(open) => {
                if (open) {
                  setMultiSelectOneOpen(false);
                  setMultiSelectTwoOpen(false);
                }
                setSelectOpenStatus(open);
              }}
              disabled
            />

            <div>
              <label>Kelengkapan</label>
              <ul className="readonly-list">
                {(questions || []).map((q) => (
                  <li key={q.id_question}>
                    <input
                      type="checkbox"
                      checked={formData?.kelengkapan?.includes(q.id_question)}
                      readOnly
                    />
                    <span>{q.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label>Verifikasi</label>
              <ul className="readonly-list">
                {(verifications || []).map((v) => (
                  <li key={v.id_question}>
                    <input
                      type="checkbox"
                      checked={formData?.verifikasi?.includes(v.id_question)}
                      readOnly
                    />
                    <span>{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Textarea
              label="Catatan"
              name="catatan"
              value={formData?.feedback ?? "-"}
              onChange={handleChange}
              disabled
            />
          </form>
        </div>
      </Modal>
      <PendingDocumentsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        code={currentMenu?.code}
      />
    </div>
  );
}

export default ListSatuanKerjaPage;
