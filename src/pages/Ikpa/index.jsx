import React, { useContext, useEffect, useState } from "react";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { buildQueryString } from "@/services/GeneralHelper";
import { apiRequest } from "@/services/APIHelper";
import { TableProperties, Upload } from "lucide-react";
import { toast } from "react-toastify";
import FileInput from "@/components/FileInput";
import Select from "@/components/Select";
import { AppContext } from "@/contexts/AppContext";
import { TableIKPA } from "./TableIKPA";

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
        result.unshift({ eselon_code: "all", name: "SEMUA SATKER" });
        console.log(result);
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
      <Card
        className="min-h-[400px]"
        icon={<TableProperties size={26} color="#D5F1FF" strokeWidth={2} />}
        color="bg-[#59C7FF]"
        title="Persentase Realisasi Anggaran per Eselon 1"
        overflow=""
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
          <div className="flex">
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
              style={{ width: "20rem" }}
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
                    className={`ml-4`}
                    icon={<Upload size={20} />}
                  >
                    Import Data IKPA
                  </Button>
                )}
            </div>
          </div>
        </div>

        <TableIKPA />
      </Card>
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
