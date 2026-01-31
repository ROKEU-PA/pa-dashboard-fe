import Table from "@/components/Table";
import { TableBody } from "@/components/TableBody";
import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import React from "react";
import { dataRealisasiPNBP, Headers } from "../constants";
import Chip from "@/components/Chip";

export const UsageRealizationTable = () => {
  return (
    <Table
      sx={{ minWidth: 650, borderRadius: "1rem" }}
      aria-label="simple table"
    >
      <TableHeader className={"rounded-lg"}>
        <TableRow>
          {Headers.map((val, index) => (
            <TableCell key={index} align="center">
              {val}
            </TableCell>
          ))}
        </TableRow>

        {/* Baris kedua */}
      </TableHeader>
      <TableBody>
        {dataRealisasiPNBP.map((val, index) => (
          <React.Fragment key={index}>
            <TableRow
              key={index}
              sx={{
                backgroundColor: (index / 2) % 1 ? "#D5F1FF" : "white",
                fontWeight: "bold",
              }}
            >
              <TableCell>{val.eselon1}</TableCell>
              <TableCell align="center">{val.targetPNBP}</TableCell>
              <TableCell align="center">{val.jumlahRealisasiPNBP}</TableCell>
              <TableCell align="center">
                {" "}
                <Chip
                  label={val?.persentase + "%"}
                  style={{
                    color: val?.persentase > 80 ? "#1C7D44" : "#FFBE02",
                    fontWeight: "bold",
                    backgroundColor:
                      val?.persentase > 80 ? "#ECFDF3" : "#FFF3D0",
                  }}
                />
              </TableCell>
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
