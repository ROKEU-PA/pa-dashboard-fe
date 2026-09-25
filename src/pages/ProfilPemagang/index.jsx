import React, { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import Table from "@/components/Table";
import TableHeader from "@/components/TableHeader";
import TableBody from "@/components/TableBody";
import TableRow from "@/components/TableRow";
import TableCell from "@/components/TableCell";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";

function ProfilPemagang() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
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
                Kampus
              </TableCell>

              <TableCell component="th">
                Posisi
              </TableCell>

              <TableCell component="th">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell colspan="4">
                <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Belum ada data pemagang.
                </div>
              </TableCell>
            </TableRow>
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
        <form className="p-6 space-y-5">
          <Input
            label="Nama"
            name="nama"
            placeholder="Masukkan nama"
          />

          <Input
            label="Kampus"
            name="kampus"
            placeholder="Masukkan nama kampus"
          />

          <Input
            label="Posisi"
            name="posisi"
            placeholder="Masukkan posisi"
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
              type="button"
              variant="primary"
            >
              {isEditMode
                ? "Simpan Perubahan"
                : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProfilPemagang;