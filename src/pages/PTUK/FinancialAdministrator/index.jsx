import Tab from "@/components/Tabs/Tab";
import TabPanel from "@/components/Tabs/TabPanel";
import Tabs from "@/components/Tabs/Tabs";
import { useFinancialAdiministrator } from "./hooks/useFinancialAdiministrator";
import { IncomeRealization } from "./Section/IncomeRealization";
import Select from "@/components/Select";
import { UsageRealization } from "./Section/UsageRealization";

const FinancialAdiministrator = () => {
  const { activeTab, handleTabChange } = useFinancialAdiministrator();

  return (
    <div>
      <div className="flex justify-between">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="contained"
          indicatorColor="bg-orange-600"
        >
          <Tab label="Realisasi Penerimaan" value="Realisasi Penerimaan" />
          <Tab label="Realisasi Pengunaan" value="Realisasi Pengunaan" />
        </Tabs>
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
      <TabPanel value="Realisasi Penerimaan" activeValue={activeTab}>
        <IncomeRealization />
      </TabPanel>
      <TabPanel value="Realisasi Pengunaan" activeValue={activeTab}>
        <UsageRealization />
      </TabPanel>
    </div>
  );
};

export default FinancialAdiministrator;
