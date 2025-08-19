import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";

const columns = [
  { key: "kode_satker", label: "Kode Satker" },
  { key: "unit_satker", label: "Unit Kerja" },
  { key: "new", label: "Baru" },
  { key: "reject", label: "Revisi" },
  { key: "approved", label: "Telah Diuji" },
  { key: "sp2d", label: "SP2D" },
  { key: "total", label: "Total" },
];

const columnsTT = [
  { key: "spp_number", label: "Nomor SPP" },
  { key: "jenis_spp", label: "Jenis SPP" },
  { key: "unit_satker", label: "Unit Kerja" },
  { key: "created_at", label: "Tanggal Pengiriman" },
  { key: "time_at", label: "Jam" },
  { key: "created_by", label: "Pengirim" },
  { key: "status", label: "Status" }
];

function TandaTerimaPage() {
  const { userData } = useContext(AppContext);
  const [dataTable, setDataTable] = useState([]);

  const fetchCount = async () => {
    try {
      const data = await apiRequest({ url: `/api/archive/summary/status` });
      let result = data.data;
      if (data.success) {
        setDataTable(result);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Status", path: "/status" }]} />
      <Title>Tanda Terima SPP</Title>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: "1rem",
            justifyContent: "space-between",
          }}
        ></div>
        
        <h3>Tanda Terima</h3>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columnsTT.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTable.map((row, index) => (
              <TableRow key={index}>
                {columnsTT.map((col) => {
                  return (
                    <TableCell key={col.key} align="center">
                      {row[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table><br></br>
        <h3>Status SPP Unit Kerja</h3>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTable.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => {
                  if (col.key == "unit_satker") {
                    return (
                      <TableCell key={col.key} align="left">
                        {row?.["unit_satker"]}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={col.key} align="center">
                      {row[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default TandaTerimaPage;
