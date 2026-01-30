import Table from "@/components/Table";
import { TableBody } from "@/components/TableBody";
import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { formatCurrency } from "@/services/GeneralHelper";
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
          <TableCell align="center">Sisa</TableCell>
        </TableRow>

        {/* Baris kedua */}
      </TableHeader>
      <TableBody>
        {[...Array(7)].map((val, index) => (
          <React.Fragment key={index}>
            <TableRow
              sx={{
                backgroundColor: (index / 2) % 1 ? "#D5F1FF" : "white",
                fontWeight: "bold",
              }}
            >
              <TableCell align="center">BINALAVOTAS</TableCell>
              <TableCell align="center">
                {formatCurrency(305715270781)}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
