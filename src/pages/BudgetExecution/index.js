import React from "react";
import Title from "@/components/Title";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import User from "@/components/User";

function BudgetExecution() {
  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Pelaksanaan Anggaran", path: "/pelaksanaan-anggaran" },
          ]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Pelaksanaan Anggaran</Title>
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <div className="flex justify-between items-center mb-4"></div>
        </Card>
      </div>
    </div>
  );
}

export default BudgetExecution;
