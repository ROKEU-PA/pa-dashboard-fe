import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { columns } from "../Ikpa/constants";
import { TableBody } from "@/components/TableBody";
import React from "react";
import Table from "@/components/Table";
import { useBudgetExecution } from "@/hooks/useBudgetExecution";

export const DetailsIKPA = ({ dataTable, loading }) => {
  const { getIKPAColor } = useBudgetExecution();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table
        sx={{ minWidth: 650, width: "100%", borderCollapse: "collapse" }}
        aria-label="modern ikpa table"
      >
        <TableHeader
          sx={{
            backgroundColor: "#F9FAFB",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <TableRow>
            {columns.map((col, index) =>
              col.children ? (
                <TableCell
                  key={index}
                  align="center"
                  colSpan={col.children.length}
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.80rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "16px 8px",
                    borderBottom: "1px solid #F3F4F6",
                    borderRight: "1px solid #F3F4F6", // Pembatas vertikal halus
                  }}
                >
                  {col.label}
                </TableCell>
              ) : (
                <TableCell
                  key={index}
                  align="center"
                  rowSpan={col.rowSpan || 1}
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.80rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "16px 12px",
                    borderBottom: "1px solid #F3F4F6",
                    borderRight:
                      index !== columns.length - 1
                        ? "1px solid #F3F4F6"
                        : "none",
                  }}
                >
                  {col.label}
                </TableCell>
              ),
            )}
          </TableRow>

          <TableRow>
            {columns.map((col) =>
              col.children
                ? col.children.map((child, idx) => (
                    <TableCell
                      key={child.key || idx}
                      align="center"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "0.80rem",
                        textTransform: "uppercase",
                        padding: "12px 8px",
                        borderBottom: "1px solid #E5E7EB",
                        borderRight: "1px solid #F3F4F6",
                      }}
                    >
                      {child.label}
                    </TableCell>
                  ))
                : null,
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                align="center"
                colSpan={12}
                sx={{ padding: "80px 0", borderBottom: "none" }}
              >
                <div className="flex justify-center items-center w-full">
                  <img
                    src="/animation/loading-animation-kemnaker-opacity.gif"
                    alt="Loading..."
                    style={{ width: 64, height: 64, objectFit: "contain" }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {dataTable &&
                Object.entries(dataTable).map(([eselonCode, group], index) => (
                  <React.Fragment key={index}>
                    {/* BARIS PARENT (Eselon 1) */}
                    {group.parent && (
                      <TableRow
                        sx={{
                          backgroundColor: "#ffffff", // Putih bersih
                          transition: "background-color 0.2s",
                          "&:hover": { backgroundColor: "#F8FAFC" },
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            color: "#111827",
                            padding: "16px 12px",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.eselon_code ?? "-"}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            fontWeight: 600,
                            color: "#111827",
                            padding: "16px 12px",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.name ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.revisi_dipa ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.deviasi_hal3_dipa ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.realisasi_anggaran ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.belanja_kontraktual ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.penyelesaian_tagihan ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.pengelolaan_up_tup ?? "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.capaian_output ?? "-"}
                        </TableCell>

                        {/* BADGE NILAI IKPA - Dipercantik */}
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid #F3F4F6",
                            padding: "16px 12px",
                          }}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-md font-bold border ${getIKPAColor(group.parent.nilai_ikpa)}`}
                            style={{ minWidth: "60px" }}
                          >
                            {group.parent.nilai_ikpa ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#9CA3AF",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.dispensasi_spm ?? "-"}
                        </TableCell>
                      </TableRow>
                    )}

                    {/* BARIS CHILDREN (Satker) */}
                    {group.children.map((row, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          backgroundColor: "#FAFAFA", // gray-50 untuk membedakan satker dari parent
                          transition: "background-color 0.2s",
                          "&:hover": { backgroundColor: "#F1F5F9" }, // slate-100 on hover
                        }}
                      >
                        {/* Kode pakai font-mono agar rapi */}
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            padding: "12px",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.satker_code}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            color: "#4B5563",
                            fontSize: "0.875rem",
                            padding: "12px",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.revisi_dipa}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.deviasi_hal3_dipa}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.realisasi_anggaran}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.belanja_kontraktual}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.penyelesaian_tagihan}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {row.pengelolaan_up_tup}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.capaian_output ?? "-"}
                        </TableCell>

                        {/* Badge satker dibikin slightly smaller atau transparan */}
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid #F3F4F6",
                            padding: "12px",
                          }}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-md font-bold border ${getIKPAColor(group.parent.nilai_ikpa)}`}
                            style={{ minWidth: "50px", opacity: 0.9 }}
                          >
                            {group.parent.nilai_ikpa ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#D1D5DB",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          {group.parent.dispensasi_spm ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
