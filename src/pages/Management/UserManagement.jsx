/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import {
  Plus,
  Settings,
  Trash2,
  UserRoundSearch,
  Search,
  Users,
} from "lucide-react";
import { cryptoEncrypter, validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import { apiRequest } from "@/services/APIHelper";
import { fetchHelperGET } from "@/services/FetchHelper";
import MultiSelect from "@/components/MultiSelect";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";

const columns = [
  { key: "username", label: "Username" },
  { key: "access", label: "Nama Biro" },
  { key: "name", label: "Nama" },
  { key: "status", label: "Status" },
  { key: "privilege", label: "Tipe Akses" },
  { key: "action", label: "Action" },
];

const mapTableData = (data) => {
  return data.map((item) => ({
    ...item,
    id: item.id,
    username: item.biro_code,
    privilege: item.role,
  }));
};

// 🔥 Pisahkan mapping warna agar JSX tetap bersih
const roleColors = {
  super_admin: { bg: "#f1f5f9", text: "#475569" }, // slate
  admin: { bg: "#fef3c7", text: "#d97706" }, // amber
  user: { bg: "#eff6ff", text: "#2563eb" }, // blue
  pic: { bg: "#ecfdf5", text: "#059669" }, // emerald
  guest: { bg: "#fff1f2", text: "#e11d48" }, // rose
  kabiro: { bg: "#d7fcff", text: "#1dd1e1" }, // rose
  tim: { bg: "#ffdaff", text: "#e11de1" }, // rose
  default: { bg: "#f8fafc", text: "#0f172a" },
};

export default function UserManagementPage() {
  const { listMenu } = useContext(AppContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [variantModal, setVariantModal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [multiSelectTwoOpen, setMultiSelectTwoOpen] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const [tableData, setTableData] = useState([]);

  const [formData, setFormData] = useState({
    account_code: "",
    name: "",
    privilege: "",
    access_code: [],
    secret: "",
  });

  const resetForm = () => {
    setFormData({
      account_code: "",
      name: "",
      privilege: "",
      access_code: [],
      secret: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitData = async (formData) => {
    try {
      const payload = {
        kode_biro: formData?.account_code,
        role: formData.privilege,
        password: cryptoEncrypter(formData.secret),
        access: JSON.stringify(formData?.access_code),
        nama: formData?.name,
      };

      const result = await apiRequest({
        url: "/user/register",
        method: "POST",
        options: { body: payload },
      });
      if (result.success) {
        toast.success("Pengguna berhasil ditambahkan!");
        setIsOpenModal(false);
      } else {
        toast.error("Gagal menambahkan pengguna. Silakan coba lagi.");
      }
    } catch (error) {
      throw new Error(error.response?.message || "Terjadi kesalahan");
    }
  };

  const editData = async (formData) => {
    try {
      const payload = {
        kode_biro: formData?.account_code,
        role: formData.privilege,
        nama: formData?.name,
        access: JSON.stringify(formData?.access_code),
      };
      if (formData.secret) {
        Object.assign(payload, {
          password: cryptoEncrypter(formData?.secret),
        });
      }

      const result = await apiRequest({
        url: `/user/edit/${formData?.id}`,
        method: "POST",
        options: { body: payload },
      });
      if (result.success) {
        toast.success("Data pengguna berhasil diperbarui!");
        setIsOpenModal(false);
      } else {
        toast.error("Gagal memperbarui pengguna. Silakan coba lagi.");
      }
    } catch (error) {
      return { hasError: true, error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.access_code ||
        !formData.name ||
        !formData.privilege ||
        !formData.access_code
      ) {
        toast.error("Mohon lengkapi semua field yang diperlukan.");
        return;
      }
      variantModal === "Add"
        ? await submitData(formData)
        : await editData(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getListUser();
    } catch (err) {
      console.error(err);
    }
  };

  const getListUser = async () => {
    let urlPath = `/user/list?page=${page + 1}&per_page=${rowsPerPage}`;
    if (searchKey) urlPath += `&search=${searchKey}`;

    try {
      const response = await apiRequest({
        url: urlPath,
      });
      if (response?.success) {
        setTableData(mapTableData(response?.data?.data || []));
        setTotalPage(response?.data?.last_page || 1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Gagal menarik data pengguna");
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiRequest({ url: "/api/user/delete/" + id, method: "DELETE" });
      getListUser();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListUser();
  }, [page, rowsPerPage, searchKey]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col gap-6">
      {/* HEADER PAGE */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#0A111E] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            Manajemen Akun
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Kelola hak akses dan data akun PIC atau Admin.
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-[#0A111E] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/10 p-6 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full md:w-auto ml-auto">
            <div className="relative w-full sm:w-[240px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="w-full h-10 pl-9 pr-4 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setIsOpenModal(true);
                setVariantModal("Add");
                resetForm();
              }}
              className="w-full sm:w-auto whitespace-nowrap shadow-md shadow-blue-500/20"
              variant="primary"
              icon={<Plus size={18} strokeWidth={2.5} />}
            >
              Tambah Akun
            </Button>
          </div>
        </div>

        {/* TABLE AREA */}
        <div className="border border-slate-100 dark:border-white/10 rounded-2xl overflow-x-auto custom-scrollbar">
          <Table sx={{ minWidth: 800 }} aria-label="user management table">
            <TableHeader className="bg-slate-50 dark:bg-white/5">
              <TableRow>
                {columns.map((data) => (
                  <TableCell
                    component="th"
                    scope="col"
                    align="center"
                    key={data.key}
                    className="py-4 text-[14px] font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {data.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-white/5">
              {tableData?.map((row) => {
                const isOnline =
                  row.last_activity &&
                  moment(row.last_activity).isAfter(
                    moment().subtract(5, "minutes"),
                  );
                const roleStyle =
                  roleColors[row?.privilege?.toLowerCase()] ||
                  roleColors.default;

                return (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      className="font-bold text-slate-700 dark:text-slate-200 text-s"
                    >
                      {row?.username}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-slate-600 dark:text-slate-400 text-s font-medium"
                    >
                      {row?.access}
                    </TableCell>
                    <TableCell
                      align="left"
                      className="text-slate-700 dark:text-slate-300 text-s font-bold"
                    >
                      {row?.name}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={isOnline ? "Online" : "Offline"}
                        style={{
                          backgroundColor: isOnline ? "#d1fae5" : "#f1f5f9",
                          color: isOnline ? "#059669" : "#64748b",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={row?.privilege?.toUpperCase()}
                        style={{
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.text,
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setVariantModal("Detail");
                            setFormData({...row, account_code: row.username});
                            setIsOpenModal(true);
                          }}
                          className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Detail"
                        >
                          <UserRoundSearch size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setVariantModal("Edit");
                            setFormData({...row, account_code: row.username, secret: row.password});
                            setIsOpenModal(true);
                          }}
                          className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 transition-colors"
                          title="Edit"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setOpenDialog(true);
                            setFormData(row);
                          }}
                          className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={page}
          totalPages={totalPage}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(e)}
        />
      </div>

      {/* MODAL FORM (Grid Layout Diperbaiki) */}
      <Modal
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          resetForm();
        }}
        title={`${variantModal} Akun Pengguna`}
        maxWidth="50vh"
      >
        {/* Tambahkan padding (p-4 atau p-5) agar isi tidak menempel ke garis modal */}
        <div className="p-5 custom-scrollbar max-h-[75vh] overflow-y-auto overflow-x-hidden">
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7"
          >
            <div className="w-full mt-2">
              <Input
                label="Username / Kode Biro"
                name="account_code"
                value={formData["account_code"]}
                onChange={handleChange}
                validate={validationSchema.onlyNumber}
                required
                disabled={variantModal === "Detail" || variantModal === "Edit"}
                placeholder="Masukkan Kode Biro / Kode Akun"
              />
            </div>

            <div className="w-full mt-2">
              <Input
                label="Nama Lengkap"
                name="name"
                disabled={variantModal === "Detail"}
                value={formData["name"]}
                onChange={handleChange}
                required
                placeholder="Masukkan Nama Lengkap"
              />
            </div>

            <div className="md:col-span-2 w-full relative z-20">
              <MultiSelect
                label="Akses Satker (Bisa pilih lebih dari satu)"
                name="access"
                value={
                  Array.isArray(formData.access_code)
                    ? listMenu
                        .filter((item) =>
                          formData.access_code.includes(item.code),
                        )
                        .map((item) => ({ label: item.name, value: item.code }))
                    : []
                }
                onChange={(selectedOptions) =>
                  setFormData((prev) => ({
                    ...prev,
                    access_code: Array.isArray(selectedOptions)
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  }))
                }
                options={listMenu.map((q) => ({
                  label: q.name,
                  value: q.code,
                }))}
                isOpen={multiSelectTwoOpen}
                setIsOpen={(open) => {
                  if (open) setSelectOpen(false);
                  setMultiSelectTwoOpen(open);
                }}
              />
            </div>

            <div className="w-full relative z-10">
              <Select
                label="Tipe Role"
                name="privilege"
                disabled={variantModal === "Detail"}
                value={formData["privilege"]}
                onChange={handleChange}
                isOpen={selectOpen}
                setIsOpen={(open) => setSelectOpen(open)}
                required
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "PIC", value: "pic" },
                  { label: "Guest", value: "guest" },
                  { label: "Kepala Biro", value: "kabiro" },
                  { label: "User Tim", value: "tim" },
                ]}
              />
            </div>

            {variantModal !== "Detail" && (
              <div className="w-full">
                <Input
                  label={
                    variantModal === "Edit"
                      ? "Password Baru (Opsional)"
                      : "Password"
                  }
                  name="secret"
                  type="password"
                  value={formData["secret"] || ""}
                  onChange={handleChange}
                  required={variantModal === "Add"}
                  placeholder="Masukkan password"
                  autoComplete="new-password"
                />
              </div>
            )}

            {variantModal !== "Detail" && (
              <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-200 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpenModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  {variantModal === "Add" ? "Simpan Akun" : "Simpan Perubahan"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </Modal>

      {/* 🔥 DIALOG HAPUS */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Konfirmasi Hapus"
        actions={
          <div className="flex gap-3">
            <Button
              onClick={() => setOpenDialog(false)}
              size="medium"
              variant="outline"
            >
              Batal
            </Button>
            <Button
              size="medium"
              variant="danger"
              onClick={() => {
                deleteUser(formData.id);
                toast.success("Akun berhasil dihapus!", {
                  position: "top-right",
                });
                setOpenDialog(false);
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus akun <b>{formData?.name}</b> secara
          permanen?
        </p>
      </Dialog>
    </div>
  );
}
