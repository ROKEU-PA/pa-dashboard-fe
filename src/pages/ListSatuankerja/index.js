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
import MultiSelect from "@/components/MultiSelect";
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
import User from "@/components/User";
import {
  columns,
  getCurrentSatuanKerja,
  isPengajuanPath,
} from "@/pages/ListSatuankerja/satkerHooks";

function ListSatuanKerjaPage() {
  const { menuName, listMenu, userData } = useContext(AppContext);
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
  });
  const [dataTable, setDataTable] = useState([]);
  const [pdfToOpen, setPDFtoOpen] = useState("");
  const [multiSelectOneOpen, setMultiSelectOneOpen] = useState(false);
  const [multiSelectTwoOpen, setMultiSelectTwoOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenStatus, setSelectOpenStatus] = useState(false);

  const getFileExtension = (url) => {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname; // /folder/filename.pdf
      return pathname.split(".").pop().toLowerCase(); // => pdf
    } catch {
      return ""; // fallback
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

  const getAcceptedFileType = (typeId) => {
    const lower = typeId?.toLowerCase();
    const rarTypes = [
      "gup",
      "ptup",
      "gup_kkp",
      "gup_pnbp",
      "gup_rm",
      "ptup_pnbp",
      "ptup_rm",
    ];
    if (rarTypes.includes(lower)) {
      return ".rar";
    }
    return ".pdf";
  };

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
        const data = await apiRequest({ url: `/api/pa/spp/type?id=` + id });
        const verif = await apiRequest({
          url: `/api/pa/spp/type?id=verifikasi`,
        });
        let result = data.data;
        let resultVerif = verif.data;
        if (data.success) {
          setQuestions(result[0].questions);
          setVerifications(resultVerif[0].questions);
        }
      } else {
        const data = await apiRequest({ url: `/api/pa/spp/type?id=` });
        let result = data.data;
        if (data.success) {
          const filteredResult = result.filter(
            (item) => item.type_id !== "verifikasi"
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
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("dokumen", formData.dokumen);
      if (!isPengajuanPath(location.pathname)) {
        payload.append("status", "arsip");
      }
      payload.append("uploaded_name", formData.uploaded_by);

      const defaultToken = localStorage.getItem("token");
      const xhr = new XMLHttpRequest();

      // Show initial toast
      const toastId = toast.info("Uploading file...", {
        progress: 0,
        autoClose: false,
        closeButton: false,
        isLoading: true,
      });

      // Progress handler
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          toast.update(toastId, {
            render: `Uploading file... (${percent}%)`,
            progress: percent / 100,
          });
        }
      };

      // Success handler
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
          toast.update(toastId, {
            render: "File berhasil diupload!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastId, {
            render: "Upload gagal. Silakan coba lagi.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      };

      // Error handler
      xhr.onerror = function () {
        toast.update(toastId, {
          render: "Terjadi kesalahan jaringan.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      };

      xhr.open(
        "POST",
        `${process.env.REACT_APP_API_BASE_URL}/api/archive/create`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);

      xhr.send(payload);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
    }
  };

  const editData = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("kode_biro", currentMenu?.code);
      payload.append("no_spp", formData.no_spp);
      payload.append("feedback", formData.feedback);
      payload.append("status", formData.status);
      payload.append("questions", JSON.stringify(formData.kelengkapan));
      payload.append("verifications", JSON.stringify(formData.verifikasi));
      payload.append("jenis_spp", formData.type);
      payload.append("tahun", formData.tahun);
      payload.append("is_edit", variantModal === "Edit" ? "true" : "false");

      const hasFileUpload =
        formData.dokumen instanceof File ||
        formData.dokumen_spm instanceof File ||
        formData.dokumen_sp2d instanceof File;

      if (
        formData.dokumen instanceof File
      ) {
        payload.append("dokumen", formData.dokumen || formData.document);
      }

      if (formData.dokumen_spm instanceof File) {
        payload.append("dokumen_spm", formData.dokumen_spm);
      }

      if (formData.dokumen_sp2d instanceof File) {
        payload.append("dokumen_sp2d", formData.dokumen_sp2d);
      }
      // for (let [key, value] of payload.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const defaultToken = localStorage.getItem("token");

      if (hasFileUpload) {
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
          } else {
            toast.update(toastId, {
              render: "Upload gagal. Silakan coba lagi.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        };

        xhr.onerror = function () {
          toast.update(toastId, {
            render: "Terjadi kesalahan jaringan.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        };

        xhr.open(
          "POST",
          `${process.env.REACT_APP_API_BASE_URL}/api/archive/edit/${formData?.id}`
        );
        xhr.setRequestHeader("Authorization", `Bearer ${defaultToken}`);
        xhr.send(payload);
      } else {
        const result = await apiRequest({
          url: `/api/archive/edit/${formData?.id}`,
          method: "POST",
          options: {
            body: payload,
          },
          isMultiType: true,
        });
        if (result.success) {
          toast.success("Data berhasil diperbarui!");
        } else {
          toast.error("Gagal memperbarui data.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupload data.");
    }
  };

  const checklistIsValid = () => {
    if (formData.status === "approved") {
      const kelengkapanChecked = formData.kelengkapan.map((item) => item.value);
      const verifikasiChecked = formData.verifikasi.map((item) => item.value);

      const allKelengkapanChecked = questions.every((q) =>
        kelengkapanChecked.includes(q.id_question)
      );

      const allVerifikasiChecked = verifications.every((v) =>
        verifikasiChecked.includes(v.id_question)
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
        variantModal === "Add" &&
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
        variantModal === "Add" &&
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
      } else if (variantModal === "Edit") {
        if (!formData?.["no_spp"] || !formData.tahun || !formData.type) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      } else if (variantModal === "Pengujian") {
        if (!formData.kelengkapan || !formData.status || !formData.verifikasi) {
          toast.error("Mohon lengkapi semua field yang diperlukan.");
          return;
        }
      }

      if (isAnyFile && formData.dokumen) {
        const file = formData.dokumen;
        const acceptedExtension = getAcceptedFileType(formData.type);
        const fileName = file.name?.toLowerCase();

        if (!fileName.endsWith(acceptedExtension)) {
          toast.error(
            `File yang diizinkan untuk tipe ini hanya ${acceptedExtension}`
          );
          return;
        }

        if (!isFileSizeValid(file)) {
          toast.error("Ukuran file melebihi 100MB");
          return;
        }
      }

      if (!checklistIsValid()) {
        toast.error(
          "Semua Kelengkapan dan Verifikasi harus dicentang sebelum status dirubah Telah Diuji."
        );
        return;
      }
      if (variantModal === "Add") {
        submitData(formData);
      } else {
        editData(formData);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      });
      fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };
  // console.log(formData);
  useEffect(
    () => {
      fetchTable();
      fetchType();
      setCurrentMenu(getCurrentSatuanKerja(listMenu, location.pathname));
    },
    [
      filter.tahun,
      filter.searchKey,
      page + 1,
      rowsPerPage,
      sortBy,
      sortDir,
      filter.startDate,
      filter.endDate,
    ],
    [listMenu]
  );
  // console.log(fileExtension);

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Satuan Kerja", path: "/satuan-kerja" },
            { name: menuName.name },
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
      <Title>{menuName.name || menuTitle}</Title>
      <Paper
        elevation={3}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Kolom Kiri: Tombol */}
          <div style={{ flex: 1 }}>
            {userData &&
              (!isPengajuanPath(location.pathname) ? (
                // Tombol "Tambah Arsip" bisa semua role
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
                  variant="danger"
                  icon={<Plus size={20} />}
                >
                  Tambah Arsip
                </Button>
              ) : (
                // Tombol "Tambah Pengajuan" - hanya user
                userData.role === "user" && (
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
                    variant="danger"
                    icon={<Plus size={20} />}
                  >
                    Tambah Pengajuan
                  </Button>
                )
              ))}
          </div>

          {/* Kolom Kanan: Form Filter */}
          <div
            style={{
              display: "flex",
              gap: 15,
              justifyContent: "flex-end",
              flexWrap: "wrap",
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
                      const statusValue = row?.[col.key];

                      // Label yang akan ditampilkan
                      const statusLabel =
                        statusValue === "approved"
                          ? "Telah Diuji"
                          : statusValue === "reject"
                          ? "Ditolak"
                          : statusValue === "sp2d"
                          ? "SP2D"
                          : "Baru";

                      // Class warna berdasarkan status
                      const statusColorClass =
                        statusValue === "approved"
                          ? "bg-green-500"
                          : statusValue === "reject"
                          ? "bg-red-500"
                          : statusValue === "sp2d"
                          ? "bg-yellow-500"
                          : "bg-blue-500";

                      return (
                        <TableCell key={col.key} align="center">
                          <span
                            className={`px-2 py-1 rounded text-white text-sm ${statusColorClass}`}
                          >
                            {statusLabel}
                          </span>
                        </TableCell>
                      );
                    }

                    if (col.key === "catatan") {
                      return (
                        <TableCell key={col.key} align="center">
                          {row?.["feedback"]}
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

                      const showDash = false; //!isPengajuan && role === "user";

                      return (
                        <TableCell key={col.key} align="center">
                          {showEditButton && (
                            <Button
                              onClick={() => {
                                setVariantModal("Edit");
                                setFormData({
                                  ...row,
                                  type: row.jenis_spp,
                                });
                                setIsOpenModal(true);
                              }}
                              style={{ width: "fit-content", margin: "5px" }}
                            >
                              Edit
                            </Button>
                          )}

                          {showPengujianButton && (
                            <Button
                              onClick={() => {
                                const kelengkapanWithLabel = questions
                                  .filter((q) =>
                                    row.question_checklist.includes(
                                      q.id_question
                                    )
                                  )
                                  .map((q) => ({
                                    label: q.text,
                                    value: q.id_question,
                                  }));

                                const verifikasiWithLabel = verifications
                                  .filter((v) =>
                                    row.verification_checklist.includes(
                                      v.id_question
                                    )
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
                              style={{
                                minWidth: "100px",
                                padding: "6px 12px",
                                margin: "5px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              variant="danger"
                            >
                              {row.status === "approved"
                                ? "Ubah Status"
                                : "Pengujian"}
                            </Button>
                          )}

                          {showDetailButton && (
                            <Button
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
                              style={{ width: "fit-content" }}
                            >
                              Detail
                            </Button>
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
            ? variantModal == "Add"
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
            setIsOpen={setSelectOpen}
          />

          {/* Tampilkan Nama Pengirim hanya jika isPengajuanPath TRUE */}
          {isPengajuanPath(location.pathname) && variantModal == "Add" && (
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

          <FileInput
            accept={getAcceptedFileType(formData?.type_id)}
            label="Dokumen"
            name="dokumen"
            onChange={handleChange}
            required
            value={formData?.document}
          />
          {userData &&
            !isPengajuanPath(location.pathname) &&
            variantModal == "Edit" &&
            userData.role !== "user" && (
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
            variantModal == "Edit" &&
            userData.role !== "user" && (
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
          {!isPengajuanPath(location.pathname) && userData.role === "pic" && (
            <Textarea
              label="Catatan"
              name="catatan"
              value={formData?.catatan}
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
        {/* <CustomPDFViewer pdfSource="/pdf-tester.pdf" /> */}
        {/* <CustomPDFViewer pdfSource={pdfToOpen} /> */}
        {/* <CustomPDFViewer pdfSource="https://rokeubmn.kemnaker.go.id/storage/documents/BrQcOw5eryN4Y8q2CRHWtBZ1gDreuhdAXXoBenI8.pdf" /> */}
        {/* <iframe
          src={`https://rokeubmn.kemnaker.go.id/storage/documents/BrQcOw5eryN4Y8q2CRHWtBZ1gDreuhdAXXoBenI8.pdf`}
          style={{ width: "100%", height: "500px" }}
          title="PDF Viewer"
        /> */}
        {fileExtension === "pdf" ? (
          <iframe
            src={`${pdfToOpen}#zoom=150`}
            style={{ width: "100%", height: "calc(100vh - 100px)" }}
            title="PDF Viewer"
          />
        ) : (
          <a href={pdfToOpen} download>
            <p>File SPP ber-format (.rar)</p>
            <br></br>
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
        width="95vw"
        maxWidth="95vw"
      >
        {/* Container utama */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            width: "115vw",
            maxWidth: "115vw",
            height: "35vw",
            maxHeight: "60vw",
          }}
        >
          {fileExtension === "pdf" ? (
            <iframe
              src={`${pdfToOpen}#zoom=120`}
              style={{ width: "100%", height: "100%" }}
              title="PDF Viewer"
            />
          ) : (
            <a href={pdfToOpen} download>
              <p>File SPP ber-format (.rar)</p>
              <br></br>
              <Button style={{ width: "100%" }}>Download File</Button>
            </a>
          )}
          <div
            style={{
              width: "80%",
              overflowY: "auto",
              maxHeight: "480px",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                padding: 20,
                width: "55%",
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
              <MultiSelect
                label="Kelengkapan"
                name="kelengkapan"
                value={formData.kelengkapan}
                onChange={(selectedOptions) =>
                  setFormData((prev) => ({
                    ...prev,
                    kelengkapan: selectedOptions,
                  }))
                }
                options={questions.map((q) => ({
                  label: q.text,
                  value: q.id_question,
                }))}
                isOpen={multiSelectOneOpen}
                setIsOpen={(open) => {
                  if (open) {
                    setSelectOpenStatus(false);
                    setMultiSelectTwoOpen(false);
                  }
                  setMultiSelectOneOpen(open);
                }}
                disabled={formData.status === "sp2d"}
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
              />
              <MultiSelect
                label="Verifikasi"
                name="verifikasi"
                value={formData?.verifikasi}
                onChange={(selectedOptions) =>
                  setFormData((prev) => ({
                    ...prev,
                    verifikasi: selectedOptions,
                  }))
                }
                options={verifications.map((q) => ({
                  label: q.text,
                  value: q.id_question,
                }))}
                isOpen={multiSelectTwoOpen}
                setIsOpen={(open) => {
                  if (open) {
                    setSelectOpenStatus(false);
                    setMultiSelectOneOpen(false);
                  }
                  setMultiSelectTwoOpen(open);
                }}
                disabled={formData.status === "sp2d"}
              />
              <Textarea
                label="Catatan"
                name="catatan"
                value={formData?.catatan}
                onChange={handleChange}
              />
              <Button type="submit" style={{ width: "100%" }}>
                Submit
              </Button>
            </form>
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
    </div>
  );
}

export default ListSatuanKerjaPage;
