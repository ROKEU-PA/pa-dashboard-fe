import React, { useContext, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import moment from "moment";
import { apiRequest } from "@/services/APIHelper";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import FileInput from "@/components/FileInput";
import { AppContext } from "@/contexts/AppContext";
import Card from "@/components/Card";
import { RealizationTable } from "./Components/RealizationTable";
import { RealizationBox } from "./Components/RealizationBox";
import { RealizationCard } from "./Components/RealizationCard";
import { useBudgetExecution } from "@/hooks/useBudgetExecution";
import { useFetchRealization } from "./hooks/useFetchRealization";
import { formatNumberID } from "@/utils/number";
import { toTitleCase } from "@/utils/text";

function RealisasiPage() {
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "all",
    year: moment().year(),
    month: moment().subtract(30, "days").format("MMMM"),
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });
  const [cardsData, setCardsData] = useState([]);

  const { data: es1Data } = useBudgetExecution();
  const {
    data: dataTable,
    dataCard,
    loading,
  } = useFetchRealization(
    filter?.eselonKey,
    filter?.searchKey,
    filter?.month,
    filter?.year,
  );

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
        url: "/pa/realization/import",
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
      // fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4 mt-4">
        <div className="row-span-2 h-full">
          <Card
            className="min-h-[400px] h-full"
            cardClassName="h-[96%]"
            icon={
              <Star size={26} fill="#FFF3D0" color="#FFF3D0" strokeWidth={2} />
            }
            color="bg-orange-text"
            title="Realisasi Kementrian Ketenagakerjaan"
            overflow=""
          >
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-r from-[#59C7FF] to-[#2F8AFD] rounded-lg text-center m-1 py-3 shadow-sm">
                <span className="font-semibold text-xl text-white ">
                  {moment()
                    .locale("id")
                    .subtract(1, "months")
                    .format("MMMM YYYY")}
                </span>
              </div>
              <RealizationBox
                bgIcon={"bg-blue-text"}
                title="Total PAGU"
                value={`Rp. ${formatNumberID(dataCard?.[0]?.pagu) ?? "0"}`}
                border={"border-2 border-blue-text"}
                main
              />
              <RealizationBox
                bgIcon={"bg-red-text"}
                title="Blokir"
                value={`Rp. 0`}
                border={"border-2 border-red-text"}
                delta={"-%"}
                deltaClassName={"text-red-text bg-red-bg "}
                main
              />
              <RealizationBox
                bgIcon={"bg-green-text"}
                title="Realisasi"
                value={`Rp. ${formatNumberID(dataCard?.[0]?.realisasi) ?? "0"}`}
                border={"border-2 border-green-text"}
                delta={`Rp. ${formatNumberID(dataCard?.[0]?.persen_realisasi) ?? "-"}`}
                deltaClassName={"text-green-text bg-green-bg "}
                main
              />
              <RealizationBox
                bgIcon={"bg-orange-text"}
                title="Sisa"
                value={`Rp. ${formatNumberID(dataCard?.[0]?.sisa) ?? "0"}`}
                border={"border-2 border-orange-text"}
                delta={`${formatNumberID(dataCard?.[0]?.persen_sisa) ?? "-"}%`}
                deltaClassName={"text-orange-text bg-orange-bg "}
                main
              />
            </div>
          </Card>
        </div>
        {dataCard
          ?.filter((_, index) => index !== 0)
          .map((item, index) => {
            return (
              <>
                <RealizationCard title={toTitleCase(item?.name)} key={index}>
                  <div className="flex flex-col text-sm font-medium">
                    <RealizationBox
                      title="Total PAGU"
                      value={`Rp. ${formatNumberID(dataCard?.[index]?.pagu) ?? "0"}`}
                      border={"border-2 border-blue-text"}
                    />
                    <RealizationBox
                      title="Blokir"
                      value={`Rp. ${formatNumberID(dataCard?.[index]?.blokir) ?? "0"}`}
                      delta={`${formatNumberID(dataCard?.[index]?.persen_blokir) ?? "-"}%`}
                      border={"border-2 border-red-text"}
                      deltaClassName={"text-red-text bg-red-bg "}
                    />
                    <RealizationBox
                      title="Realisasi"
                      value={`Rp. ${formatNumberID(dataCard?.[index]?.realisasi) ?? "0"}`}
                      delta={`${formatNumberID(dataCard?.[index]?.persen_realisasi) ?? "-"}%`}
                      border={"border-2 border-green-text"}
                      deltaClassName={"text-green-text bg-green-bg "}
                    />
                    <RealizationBox
                      title="Sisa"
                      value={`Rp. ${formatNumberID(dataCard?.[index]?.sisa) ?? "0"}`}
                      delta={`${formatNumberID(dataCard?.[index]?.persen_sisa) ?? "-"}%`}
                      border={"border-2 border-orange-text"}
                      deltaClassName={"text-orange-text bg-orange-bg "}
                    />
                  </div>
                </RealizationCard>
              </>
            );
          })}
      </div>

      <RealizationTable
        filter={filter}
        setFilter={setFilter}
        es1Data={es1Data}
        selectOpen={selectOpen}
        setSelectOpen={setSelectOpen}
        userData={userData}
        setIsOpenModal={setIsOpenModal}
        dataTable={dataTable}
      />
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

export default RealisasiPage;
