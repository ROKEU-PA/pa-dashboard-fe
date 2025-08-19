import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Select from "@/components/Select";
import { apiRequest } from "@/services/APIHelper";
import FileInput from "@/components/FileInput";
import Button from "@/components/Button";
import { toast } from "react-toastify";

function DashboardManagementPage() {
  const [formData, setFormData] = useState({
    image_id: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    let isAnyFile = formData?.image;

    try {
      if (isAnyFile && (!formData.image_id || !formData.image)) {
        toast.error("Mohon lengkapi semua field yang diperlukan.");
        return;
      }

      submitData(formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil disimpan!");
      setFormData({
        image_id: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const submitData = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("image_id", formData.image_id);
      payload.append("image", formData.image);

      const result = await apiRequest({
        url: "/api/dashboard/management/upload",
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

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Dashboard Management", path: "/dashboard-management" },
        ]}
      />
      <Title>Manajemen Dashboard</Title>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
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
            <Select
              label="Posisi Gambar Dashboard"
              name="image_id"
              value={formData?.image_id}
              onChange={handleChange}
              required
              options={[
                { label: "Dashboard Utama", value: "UTM" },
                { label: "PTUK", value: "PTUKP" },
                { label: "Pelaksanaan Anggaran", value: "PAP" },
                { label: "Barang Milik Negara", value: "BMNP" },
                { label: "Akuntansi Pelaporan", value: "ALP" },
                { label: "Tata Usaha", value: "TUP" },
                { label: "Struktur Organisasi", value: "SOP"},
                { label: "Helpdesk", value: "HDP"}
              ]}
            />
            <FileInput
              accept=".png, .jpg, .jpeg"
              label="Upload Gambar"
              name="image"
              onChange={handleChange}
              required
              value={formData?.image}
            />
            <Button type="submit" style={{ float: "right" }}>
              Submit
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default DashboardManagementPage;
