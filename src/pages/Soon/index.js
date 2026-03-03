import React from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";

function SoonPage() {
  return (
    <div>
      <Paper
        elevation={3}
        style={{
          backgroundColor: "#FFF9C4",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
            minHeight: "400px",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "#795548", margin: 0 }}>
            Halaman sedang dalam pengembangan :)
          </h1>
          <img
            src="/under-construct.gif"
            alt="under-maintenance"
            style={{ maxWidth: "300px", width: "100%" }}
          />
        </div>
      </Paper>
    </div>
  );
}

export default SoonPage;
