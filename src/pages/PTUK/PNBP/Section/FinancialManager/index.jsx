import Card from "@/components/Card";
import Select from "@/components/Select";
import { ChartNoAxesColumn, Flame } from "lucide-react";
import { FinancialManagerPieCharts } from "./components/FinancialManagerPieCharts";
import { TableFinancialManager2 } from "./components/TableFinancialManager";
import { Box } from "@/components/Box";

export const FinancialManager = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
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
        <Select
          label="Jabatan"
          placeholder="Pilih Jabatan"
          style={{ width: "calc(100vw/4.2)" }}
          //   value={filter.searchKey}
          //   onChange={(e) =>
          //     setFilter((prev) => ({
          //       ...prev,
          //       searchKey: e.target.value,
          //     }))
          //   }
        />
        <Select
          label="Jabatan Fungsional"
          placeholder="Pilih Jabatan Fungsional"
          style={{ width: "calc(100vw/4.2)" }}
          //   value={filter.searchKey}
          //   onChange={(e) =>
          //     setFilter((prev) => ({
          //       ...prev,
          //       searchKey: e.target.value,
          //     }))
          //   }
        />
      </div>
      <Card
        className="h-fit"
        icon={<ChartNoAxesColumn size={26} color="#2F8AFD" strokeWidth={2} />}
        color="bg-blue-bg"
      >
        <div className="flex flex-col gap-4">
          <FinancialManagerPieCharts />
          <div className="flex justify-between mx-1">
            <Box
              title={"Pejabat Pembuat Komitmen"}
              color={"bg-red-text"}
              icon={<Flame size={26} color={"#FFCFE2"} strokeWidth={2} />}
              value={100}
              boxShadow
              className={"min-w-[24%]"}
            />
            <Box
              title={"Pejabat Penandatangan SPM"}
              color={"bg-orange-text"}
              icon={<Flame size={26} color={"#FFF3D0"} strokeWidth={2} />}
              value={51}
              boxShadow
              className={"min-w-[24%]"}
            />
            <Box
              title={"Bendahara Pengeluaran"}
              color={"bg-blue-text"}
              icon={<Flame size={26} color={"#D5F1FF"} strokeWidth={2} />}
              value={72}
              boxShadow
              className={"min-w-[24%]"}
            />
            <Box
              title={"Bendahara Penerimaan"}
              color={"bg-green-text"}
              icon={<Flame size={26} color={"#EDF6D0"} strokeWidth={2} />}
              value={24}
              boxShadow
              className={"min-w-[24%]"}
            />
          </div>
          <TableFinancialManager2 />
        </div>
      </Card>
    </div>
  );
};
