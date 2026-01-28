import { LHPSection } from "@/pages/PTUKDashboard/components/LHPSection";
import moment from "moment";
import { LHPTable } from "./components/LHPTable";

const PTUKLHP = () => {
  return (
    <div className="flex flex-col gap-4">
      <LHPSection
        details={
          "Data berdasarkan TLHP Semester II tahun 2026 + LHP Kepatuhan terkait BLKK + LHP Kinerja Terkait Pengawasan Kemnaker"
        }
        subCaption={
          moment().subtract(10, "years").format("YYYY") +
          "-" +
          moment().format("YYYY")
        }
      >
        <LHPTable />
      </LHPSection>
    </div>
  );
};

export default PTUKLHP;
