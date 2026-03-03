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
import { dataTable } from "../BudgetExecution/constants";
import { dataTables } from "./constants";
import { RealizationTable } from "./Components/RealizationTable";
import { RealizationBox } from "./Components/RealizationBox";
import { RealizationCard } from "./Components/RealizationCard";

function RealisasiPage() {
  const { userData } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [es1Data, setEs1Data] = useState([]);
  const [filter, setFilter] = useState({
    searchKey: "",
    eselonKey: "",
  });
  const [formData, setFormData] = useState({
    dokumen: null,
  });
  const [cardsData, setCardsData] = useState([]);
  const formatMiliar = (num) => {
    if (!num && num !== 0) return "-";
    return (num / 1_000_000_000).toFixed(2) + " M";
  };
  // const fetchTable = async () => {
  //   try {
  //     const query = buildQueryString({
  //       eselon_code: filter.eselonKey,
  //       search_key: filter.searchKey,
  //     });
  //     const data = await apiRequest({
  //       url: `/api/pa/ikpa/all?${query}`,
  //     });
  //     let result = data?.data;
  //     if (data.success) {
  //       setDataTable(result);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const es1Options = async () => {
    try {
      const data = { success: true, data: dataTables };

      if (!data?.success || !data?.data) return;
      let mapped = data.data
        // .filter((q) => q.satker_code === null)
        .map((item, index) => {
          const constantItem = dataTable.data[index];
          const perJenis = item.per_jenis || {};

          const totalPagu = item.pagu || 0;
          const totalRealisasi = item.realisasi || 0;
          const totalPersen = item.persen_realisasi || 0;
          const totalSisa = item.sisa || 0;

          const pegawai = perJenis["51"] || {};
          const barang = perJenis["52"] || {};
          const modal = perJenis["53"] || {};

          return {
            title: constantItem?.eselon || item.name,
            pagu: totalPagu,
            realisasiNominal: totalRealisasi,
            realisasiPersen: totalPersen,
            blokir: totalSisa,
            blokirPersen: ((totalSisa / totalPagu) * 100).toFixed(2),
            targetNominal: totalPagu * 0.95,
            targetPersen: 95,
          };
        });

      console.log("cardsData mapped:", mapped);
      setCardsData(mapped);
    } catch (error) {
      console.error("Error mapping data:", error);
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
        url: "/pa/realization/import",
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
      // fetchTable();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const groupedData = dataTables.reduce((acc, row) => {
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
    // fetchTable();
    es1Options();
  }, [filter.searchKey, filter.eselonKey]);

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
                value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                border={"border-2 border-blue-text"}
                main
              />
              <RealizationBox
                bgIcon={"bg-red-text"}
                title="Blokir"
                value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                border={"border-2 border-red-text"}
                delta={"20%"}
                deltaClassName={"text-red-text bg-red-bg "}
                main
              />
              <RealizationBox
                bgIcon={"bg-green-text"}
                title="Realisasi"
                value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                border={"border-2 border-green-text"}
                delta={"58%"}
                deltaClassName={"text-green-text bg-green-bg "}
                main
              />
              <RealizationBox
                bgIcon={"bg-orange-text"}
                title="Realisasi"
                value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                border={"border-2 border-orange-text"}
                delta={"58%"}
                deltaClassName={"text-orange-text bg-orange-bg "}
                main
              />
            </div>
          </Card>
        </div>
        {cardsData
          ?.filter((_, index) => index !== 0)
          .map((item, index) => {
            return (
              <RealizationCard title={item?.title}>
                <div className="flex flex-col text-sm font-medium">
                  <RealizationBox
                    title="Total PAGU"
                    value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                    border={"border-2 border-blue-text"}
                  />
                  <RealizationBox
                    title="Blokir"
                    value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                    border={"border-2 border-red-text"}
                    delta={"20%"}
                    deltaClassName={"text-red-text bg-red-bg "}
                  />
                  <RealizationBox
                    title="Realisasi"
                    value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                    border={"border-2 border-green-text"}
                    delta={"58%"}
                    deltaClassName={"text-green-text bg-green-bg "}
                  />
                  <RealizationBox
                    title="Realisasi"
                    value={`Rp ${(2123 / 1_000).toFixed(2)} M`}
                    border={"border-2 border-orange-text"}
                    delta={"58%"}
                    deltaClassName={"text-orange-text bg-orange-bg "}
                  />
                </div>
              </RealizationCard>
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
