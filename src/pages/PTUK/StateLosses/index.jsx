import Card from "@/components/Card";
import Select from "@/components/Select";
import { PTUKCard } from "@/pages/PTUKDashboard/components/PTUKCard";
import { formatCurrency } from "@/services/GeneralHelper";
import { ChartNoAxesColumn, Flame } from "lucide-react";

const StateLosses = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="place-self-end flex gap-4">
        <Select
          label="Tahun"
          style={{ width: "200px" }}
          placeholder="Pilih Tahun"
          //   value={filter.searchKey}
          //   onChange={(e) =>
          //     setFilter((prev) => ({
          //       ...prev,
          //       searchKey: e.target.value,
          //     }))
          //   }
        />
        <div className="flex">
          <Select
            label="Eselon 1"
            name="eselon_code"
            // onChange={(e) =>
            //   setFilter((prev) => ({
            //     ...prev,
            //     eselonKey: e.target.value ?? "",
            //   }))
            // }
            // value={filter.eselonKey}
            // options={es1Data.map((q) => ({
            //   label: q.name,
            //   value: q.eselon_code,
            // }))}
            style={{ width: "20rem" }}
            // isOpen={selectOpen}
            // setIsOpen={setSelectOpen}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <PTUKCard
          title={"Kerugian Negara"}
          color={"bg-red-text"}
          icon={<Flame size={26} color={"#FFCFE2"} strokeWidth={2} />}
          value={formatCurrency(397275483022)}
        />
        <PTUKCard
          title={"Jumlah Tindak Lanjut"}
          color={"bg-green-text"}
          icon={<Flame size={26} color={"#EDF6D0"} strokeWidth={2} />}
          value={formatCurrency(88483022997)}
        />
      </div>
      <Card
        title={"Rekap Tindak Lanjut & Kerugian Negara"}
        details={
          "Jumlah Tindak Lanjut dan Kerugian Negara Kementrian Ketenagakerjaan"
        }
        className="h-fit"
        icon={<ChartNoAxesColumn size={26} color="#2F8AFD" strokeWidth={2} />}
        color="bg-blue-bg"
      ></Card>
    </div>
  );
};

export default StateLosses;
