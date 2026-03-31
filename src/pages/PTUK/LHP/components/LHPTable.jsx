import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { TableBody } from "@/components/TableBody";
import React from "react";
import moment from "moment";
import Table from "@/components/Table";
import { columns, dummyGroupedData } from "@/pages/Ikpa/constants";

export const LHPTable = () => {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHeader>
        <TableRow>
          {columns.map((col, index) =>
            col.children ? (
              <TableCell
                key={index}
                align="center"
                colSpan={col.children.length}
              >
                {col.label}
              </TableCell>
            ) : (
              <TableCell key={index} align="center" rowSpan={col.rowSpan || 1}>
                {col.label}
              </TableCell>
            ),
          )}
        </TableRow>

        {/* Baris kedua */}
        <TableRow>
          {columns.map((col) =>
            col.children
              ? col.children.map((child, idx) => (
                  <TableCell key={child.key || idx} align="center">
                    {child.label}
                  </TableCell>
                ))
              : null,
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(dummyGroupedData).map(([eselonCode, group], index) => (
          <React.Fragment key={eselonCode}>
            {/* Row utama (group) */}
            {group.parent && (
              <TableRow sx={{ backgroundColor: "#D5F1FF", fontWeight: "bold" }}>
                <TableCell align="center">{group.parent.eselon_code}</TableCell>
                <TableCell align="center">{group.parent.name}</TableCell>
                <TableCell align="center">{group.parent.revisi_dipa}</TableCell>
                <TableCell align="center">
                  {group.parent.deviasi_hal3_dipa}
                </TableCell>
                <TableCell align="center">
                  {group.parent.realisasi_anggaran}
                </TableCell>
                <TableCell align="center">
                  {group.parent.belanja_kontraktual}
                </TableCell>
                <TableCell align="center">
                  {group.parent.penyelesaian_tagihan}
                </TableCell>
                <TableCell align="center">
                  {group.parent.pengelolaan_up_tup}
                </TableCell>
                <TableCell align="center">
                  {group.parent.capaian_output}
                </TableCell>
                <TableCell align="center">{group.parent.nilai_ikpa}</TableCell>
                <TableCell align="center">
                  {group.parent.dispensasi_spm}
                </TableCell>
                <TableCell align="center">
                  {moment(group.parent.tanggal_sumber_data).format(
                    "YYYY/MM/DD",
                  )}
                </TableCell>
              </TableRow>
            )}
            {group.parent && (
              <TableRow sx={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
                <TableCell align="center" colSpan="2">
                  {"Nilai Aspek"}
                </TableCell>
                <TableCell align="center" colSpan="2">
                  {Math.round(
                    ((group.parent.revisi_dipa +
                      group.parent.deviasi_hal3_dipa) /
                      2) *
                      100,
                  ) / 100}
                </TableCell>
                <TableCell align="center" colSpan="4">
                  {Math.round(
                    ((group.parent.realisasi_anggaran +
                      group.parent.belanja_kontraktual +
                      group.parent.penyelesaian_tagihan +
                      group.parent.pengelolaan_up_tup) /
                      4) *
                      100,
                  ) / 100}
                </TableCell>
                <TableCell align="center" colSpan="1">
                  {Math.round(group.parent.capaian_output * 100) / 100}
                </TableCell>
                <TableCell align="center" colSpan="3">
                  {""}
                </TableCell>
              </TableRow>
            )}

            {/* Row anak (satker) */}
            {group.children.map((row, idx) => (
              <TableRow
                key={row.id}
                sx={{ backgroundColor: "#EBF8FF", fontWeight: "bold" }}
              >
                <TableCell align="center">{row.satker_code}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.revisi_dipa}</TableCell>
                <TableCell align="center">{row.deviasi_hal3_dipa}</TableCell>
                <TableCell align="center">{row.realisasi_anggaran}</TableCell>
                <TableCell align="center">{row.belanja_kontraktual}</TableCell>
                <TableCell align="center">{row.penyelesaian_tagihan}</TableCell>
                <TableCell align="center">{row.pengelolaan_up_tup}</TableCell>
                <TableCell align="center">{row.dispensasi_spm}</TableCell>
                <TableCell align="center">{row.capaian_output}</TableCell>
                <TableCell align="center">{row.nilai_ikpa}</TableCell>
                <TableCell align="center">
                  {moment(row.tanggal_sumber_data).format("YYYY/MM/DD")}
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
