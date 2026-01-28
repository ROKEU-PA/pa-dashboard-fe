import Table from "@/components/Table";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { dataTable, Headers } from "../constants";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import React from "react";
import Chip from "@/components/Chip";
import { formatCurrency } from "@/services/GeneralHelper";

export const RecapTable = () => {
  return (
    <Table
      sx={{ minWidth: 650, borderRadius: "1rem" }}
      aria-label="simple table"
    >
      <TableHeader className={"rounded-lg"}>
        <TableRow>
          {Headers.map((col, index) =>
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
      </TableHeader>
      <TableBody>
        {dataTable.map((val, index) => (
          <React.Fragment key={index}>
            <TableRow
              sx={{
                backgroundColor: (index / 2) % 1 ? "#D5F1FF" : "white",
                fontWeight: "bold",
              }}
            >
              <TableCell align="center">{val.eselon_1}</TableCell>
              <TableCell align="center">
                {formatCurrency(val.kerugian_negara)}
              </TableCell>
              <TableCell align="center">
                {formatCurrency(val.jumlah_tindak_lanjut)}
              </TableCell>
              <TableCell align="center">{formatCurrency(val.sisa)}</TableCell>
              <TableCell align="center">
                <Chip
                  label={val?.persentase + "%"}
                  style={{
                    color: val?.persentase > 80 ? "#1C7D44" : "#FFBE02",
                    fontWeight: "bold",
                    backgroundColor:
                      val?.persentase > 80 ? "#ECFDF3" : "#FFF3D0",
                  }}
                />{" "}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
