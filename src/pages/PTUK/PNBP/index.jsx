import Tab from "@/components/Tabs/Tab";
import TabPanel from "@/components/Tabs/TabPanel";
import Tabs from "@/components/Tabs/Tabs";
import { usePNBP } from "./hooks/usePNBP";
import { FinancialManager } from "./Section/FinancialManager";
import { FinancialManager2 } from "./Section/FinancialManager2";

const PNBP = () => {
  const { activeTab, handleTabChange } = usePNBP();

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="contained"
        indicatorColor="bg-orange-600"
      >
        <Tab label="???" value="tab1" />
        <Tab label="Pengelola Keuangan" value="Pengelola Keuangan" />
      </Tabs>

      <TabPanel value="tab1" activeValue={activeTab}>
        <FinancialManager2 />
      </TabPanel>
      <TabPanel value="Pengelola Keuangan" activeValue={activeTab}>
        <FinancialManager />
      </TabPanel>
    </div>
  );
};

export default PNBP;
