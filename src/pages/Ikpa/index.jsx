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
import { getYears, months } from "@/constants/general";
import moment from "moment";
import { toTitleCase } from "@/utils/text";

function IkpaPage() {
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectOpenMonth, setSelectOpenMonth] = useState(false);
  const [selectOpenYear, setSelectOpenYear] = useState(false);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "all",
    year: moment().subtract(1, "years").year(),
    month: moment().format("MMMM"),
  });

  const [formData, setFormData] = useState({
    dokumen: null,
  });

  const { data: es1Data, refetch: fetchEs1Data } = useBudgetExecution();

  const {
    data: dataTable,
    refetch,
    loading,
  } = useFetchIKPA({
    eselonCode: filter?.eselonKey,
    searchKey: filter?.searchKey,
    month: filter?.month,
    year: filter?.year,
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
          <div className="flex gap-2">
            <Select
              label="Bulan"
              name="Month"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  month: e.target.value ?? "",
                }))
              }
              value={filter.month}
              options={months?.map((q) => ({
                label: q,
                value: q,
              }))}
              style={{ width: "7.25rem" }}
              isOpen={selectOpenMonth}
              setIsOpen={setSelectOpenMonth}
            />
            <Select
              label="Tahun"
              name="year"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  year: e.target.value ?? "",
                }))
              }
              value={filter.year}
              options={getYears()?.map((q) => ({
                label: q,
                value: q,
              }))}
              style={{ width: "7.25rem" }}
              isOpen={selectOpenYear}
              setIsOpen={setSelectOpenYear}
            />
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
                label: toTitleCase(q.name),
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

        <TableIKPA dataTable={dataTable} loading={loading} />
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
