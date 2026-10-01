import { useState, useCallback } from "react";

import {
  getProfilPemagang,
  createProfilPemagang,
  updateProfilPemagang,
  deleteProfilPemagang,
} from "../services/profilPemagang.js";

function useProfilPemagang() {
  const [formData, setFormData] = useState({
    name: "",
    campus_origin: "",
    position: "",
    phone_number: "",
  });

  const [dataPemagang, setDataPemagang] = useState([]);

  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.campus_origin.trim() ||
      !formData.position.trim() ||
      !formData.phone_number.trim()
    ) {
      setErrorMessage(
        "Nama, Asal Kampus, Posisi, dan Nomor HP wajib diisi."
      );

      setIsErrorOpen(true);

      return false;
    }

    return true;
  };

  const handleCloseError = () => {
    setIsErrorOpen(false);
    setErrorMessage("");
  };

  // GET
  const fetchDataPemagang = useCallback(async () => {
    try {
      const response = await getProfilPemagang();

      setDataPemagang(response?.data || []);
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal mengambil data pemagang."
      );

      setIsErrorOpen(true);
    }
  }, []);

  // POST
  const createDataPemagang = async () => {
    try {
      await createProfilPemagang(formData);
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal menambahkan data pemagang."
      );

      setIsErrorOpen(true);

      throw error;
    }
  };

  // PUT
  const updateDataPemagang = async (id) => {
    try {
      await updateProfilPemagang(id, formData);
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal mengubah data pemagang."
      );

      setIsErrorOpen(true);

      throw error;
    }
  };

  // DELETE
  const deleteDataPemagang = async (id) => {
    try {
      await deleteProfilPemagang(id);
    } catch (error) {
      setErrorMessage(
        error.message || "Gagal menghapus data pemagang."
      );

      setIsErrorOpen(true);

      throw error;
    }
  };

  return {
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
  };
}

export default useProfilPemagang;