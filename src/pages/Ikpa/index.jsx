import React, { useContext, useEffect, useState } from "react";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { apiRequest } from "@/services/APIHelper";
import { TableProperties, Upload } from "lucide-react";
import { toast } from "react-toastify";
import FileInput from "@/components/FileInput";
import Select from "@/components/Select";
import { AppContext } from "@/contexts/AppContext";
import { TableIKPA } from "./TableIKPA";
import { useFetchIKPA } from "./hooks/useFetchIKPA";
import { useBudgetExecution } from "@/hooks/useBudgetExecution";

function IkpaPage() {
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "all",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });

  const { data: es1Data, refetch: fetchEs1Data } = useBudgetExecution();

  const { data: dataTable, refetch } = useFetchIKPA({
    eselonCode: filter?.eselonKey,
    searchKey: filter?.searchKey,
  });

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    refetch();
    fetchEs1Data();
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
              options={es1Data?.map((q) => ({
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

        <TableIKPA dataTable={dataTable} />
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
