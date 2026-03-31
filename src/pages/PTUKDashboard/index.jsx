import { Flame } from "lucide-react";
import { AdminstrationSection } from "./components/AdministrationSection";
import { LHPSection } from "./components/LHPSection";
import { PTUKCard } from "./components/PTUKCard";
import { formatCurrency } from "@/services/GeneralHelper";

const PTUKDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <LHPSection />
      <div className="grid grid-cols-2 gap-4">
        {CardData &&
          CardData.map((val) => (
            <PTUKCard
              title={val?.title}
              color={val?.color}
              icon={
                <Flame size={26} color={val?.secondaryColor} strokeWidth={2} />
              }
              value={formatCurrency(2185483022)}
            />
          ))}
      </div>
      <AdminstrationSection />
    </div>
  );
};

const CardData = [
  {
    title: "Kerugian Negara",
    secondaryColor: "#FFFFFF",
    color: "bg-red-text",
  },
  {
    title: "Jumlah Tindak Lanjut",
    secondaryColor: "#FFFFFF",
    color: "bg-green-text",
  },
  {
    title: "Jumlah Realisasi PNBP",
    secondaryColor: "#FFFFFF",
    color: "bg-orange-text",
  },
  {
    title: "Target PNBP Kementrian",
    secondaryColor: "#FFFFFF",
    color: "bg-blue-text",
  },
  {
    title: "Pagu DIPA SUmber Dana PNBP",
    secondaryColor: "#FFFFFF",
    color: "bg-red-text",
  },
  {
    title: "Jumlah Realisasi Penggunaan Dana PNBP",
    secondaryColor: "#FFFFFF",
    color: "bg-green-text",
  },
];

export default PTUKDashboard;
