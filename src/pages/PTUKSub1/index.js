import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";

function PTUKSub1Page() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "Dashboard Utama", path: "/dashboard" }]} />
      <Title>Tuntutan Ganti Rugi</Title>
      <Paper elevation={3} style={{ backgroundColor: "#F5F6F7" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <iframe
            width="1000"
            height="600"
            src="https://lookerstudio.google.com/embed/reporting/8036b839-dd6d-4c88-9d49-e9fb949d6f46/page/zE3TF"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </Paper>
    </div>
  );
}

export default PTUKSub1Page;
