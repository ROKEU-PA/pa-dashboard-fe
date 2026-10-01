import React, { useEffect, useState } from "react";

import { Pencil, Plus, Trash2 } from "lucide-react";

import Table from "@/components/Table";
import TableHeader from "@/components/TableHeader";
import { TableBody } from "@/components/TableBody";
import TableRow from "@/components/TableRow";
import TableCell from "@/components/TableCell";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";

import useProfilPemagang from "./hooks/useProfilPemagang.jsx";

function ProfilPemagang() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    formData,
    handleChange,
    validateForm,
    isErrorOpen,
    errorMessage,
    handleCloseError,
    dataPemagang,
    fetchDataPemagang,
    createDataPemagang,
    updateDataPemagang,
    deleteDataPemagang,
  } = useProfilPemagang();

  useEffect(() => {
    fetchDataPemagang();
  }, [fetchDataPemagang]);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (data) => {
    setIsEditMode(true);
    setSelectedId(data.id);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await updateDataPemagang(selectedId);
      } else {
        await createDataPemagang();
      }

      await fetchDataPemagang();

      handleCloseModal();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDataPemagang(selectedId);

      await fetchDataPemagang();

      setIsDeleteOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Data Diri Pemagang
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Kelola data diri pemagang.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={handleOpenAdd}
        >
          Tambah Pemagang
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell component="th">
                Nama
              </TableCell>

              <TableCell component="th">
                Asal Kampus
              </TableCell>

              <TableCell component="th">
                Posisi
              </TableCell>

              <TableCell component="th">
                Nomor HP
              </TableCell>

              <TableCell component="th">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataPemagang.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name}
                </TableCell>

                <TableCell>
                  {item.campus_origin}
                </TableCell>

                <TableCell>
                  {item.position}
                </TableCell>

                <TableCell>
                  {item.phone_number}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      icon={<Pencil size={16} />}
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      icon={<Trash2 size={16} />}
                      onClick={() =>
                        handleOpenDelete(item.id)
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {dataPemagang.length === 0 && (
              <TableRow>
                <TableCell colspan="5">
                  <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Belum ada data pemagang.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={
          isEditMode
            ? "Edit Data Pemagang"
            : "Tambah Data Pemagang"
        }
      >
        <form
          className="p-6 space-y-5"
          onSubmit={handleSubmit}
        >
          <Input
            label="Nama"
            name="name"
            placeholder="Masukkan nama"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Asal Kampus"
            name="campus_origin"
            placeholder="Masukkan asal kampus"
            value={formData.campus_origin}
            onChange={handleChange}
            required
          />

          <Input
            label="Posisi"
            name="position"
            placeholder="Masukkan posisi"
            value={formData.position}
            onChange={handleChange}
            required
          />

          <Input
            label="Nomor HP"
            name="phone_number"
            placeholder="Masukkan nomor HP"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Batal
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              {isEditMode
                ? "Simpan Perubahan"
                : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ERROR ALERT */}
      <Dialog
        open={isErrorOpen}
        onClose={handleCloseError}
        title="Data Belum Lengkap"
      >
        <p>
          {errorMessage ||
            "Nama, Asal Kampus, Posisi, dan Nomor HP wajib diisi."}
        </p>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Hapus Data Pemagang"
      >
        <p>
          Apakah Anda yakin ingin menghapus data pemagang ini?
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default ProfilPemagang;