import Card from "@/components/Card";
import { ChartNoAxesColumn, Flame } from "lucide-react";
import IncomeRealizationCharts from "./components/IncomeRealizationCharts";
import { IncomeRealizationTable } from "./components/IncomeRealizationTable";
import { Box } from "@/components/Box";
import { formatCurrency } from "@/services/GeneralHelper";

export const IncomeRealization = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <Box
          title={"Jumlah Realisasi PNBP"}
          color={"bg-green-text"}
          icon={<Flame size={26} color={"#EDF6D0"} strokeWidth={2} />}
          value={formatCurrency(1407328376733)}
          className={"w-full"}
        />
        <Box
          title={"Target PNBP Kementrian"}
          color={"bg-red-text"}
          icon={<Flame size={26} color={"#FFCFE2"} strokeWidth={2} />}
          value={formatCurrency(397407328376733)}
          className={"w-full"}
        />
      </div>
      <Card
        title={
          "Target dan Realisasi Penerimaan PNBP Kementerian Ketenagakerjaan"
        }
        className="h-fit"
        icon={<ChartNoAxesColumn size={26} color="#2F8AFD" strokeWidth={2} />}
        color="bg-blue-bg"
      >
        <div className="flex flex-col gap-4">
          <IncomeRealizationCharts />
          <IncomeRealizationTable />
        </div>
      </Card>
    </div>
  );
};
