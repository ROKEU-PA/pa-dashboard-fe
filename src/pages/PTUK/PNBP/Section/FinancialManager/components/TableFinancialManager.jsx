import Table from "@/components/Table";
import { TableBody } from "@/components/TableBody";
import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import React from "react";

export const TableFinancialManager2 = () => {
  return (
    <Table
      sx={{ minWidth: 650, borderRadius: "1rem" }}
      aria-label="simple table"
    >
      <TableHeader className={"rounded-lg"}>
        <TableRow>
          <TableCell align="center">Eselon 1</TableCell>
          <TableCell align="center">Jabatan</TableCell>
          <TableCell align="center">Unit</TableCell>
          <TableCell align="center">Jabatan Fungsional</TableCell>
          <TableCell align="center">Tanggal Sertifikat</TableCell>
        </TableRow>

        {/* Baris kedua */}
      </TableHeader>
      <TableBody>
        {dataPegawai.map((val, index) => (
          <React.Fragment key={index}>
            <TableRow
              key={index}
              sx={{
                backgroundColor: (index / 2) % 1 ? "#D5F1FF" : "white",
                fontWeight: "bold",
              }}
            >
              <TableCell align="center">{val.namaNip}</TableCell>
              <TableCell align="center">{val.jabatan}</TableCell>
              <TableCell align="center">{val.unit}</TableCell>
              <TableCell align="center">{val.jabatanFungsional}</TableCell>
              <TableCell align="center">{val.tanggalSertifikat}</TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

const dataPegawai = [
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Bendahara Pengeluaran",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: null,
    tanggalSertifikat: "16 Des 2022",
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Bendahara Pengeluaran",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: null,
    tanggalSertifikat: "31 Mei 2023",
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Pejabat Pembuat Komitmer",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: "PKAPBN - BP",
    tanggalSertifikat: null,
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Bendahara Pengeluaran",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: null,
    tanggalSertifikat: "6 Agustus 2025",
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Pejabat Pembuat Komitmer",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: null,
    tanggalSertifikat: "30 Agustus 2023",
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Bendahara Pengeluaran",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: "PKAPBN - BP",
    tanggalSertifikat: null,
  },
  {
    namaNip: "Zulaepa Chaironisa, A. Md / 199306..",
    jabatan: "Pejabat Pembuat Komitmer",
    unit: "0261.626011 Pusat Pasar Ke",
    jabatanFungsional: null,
    tanggalSertifikat: "9 Maret 2020",
  },
];
