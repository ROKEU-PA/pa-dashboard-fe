import Card from "@/components/Card";
import { ChartNoAxesColumn, Flame } from "lucide-react";
import UsageRealizationCharts from "./components/UsageRealizationCharts";
import { UsageRealizationTable } from "./components/UsageRealizationTable";
import { Box } from "@/components/Box";
import { formatCurrency } from "@/services/GeneralHelper";

export const UsageRealization = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <Box
          title={"Pagu DIPA SUmber Dana PNBP"}
          color={"bg-green-text"}
          icon={<Flame size={26} color={"#EDF6D0"} strokeWidth={2} />}
          value={formatCurrency(1407328376733)}
          className={"w-full"}
        />
        <Box
          title={"Jumlah Realisasi Penggunaan Dana PNBP"}
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
          <UsageRealizationCharts />
          <UsageRealizationTable />
        </div>
      </Card>
    </div>
  );
};
