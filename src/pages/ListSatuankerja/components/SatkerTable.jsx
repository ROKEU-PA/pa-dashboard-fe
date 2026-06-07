import React from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import TableSortLabel from "@/components/TableSortLabel";
import { Edit2, Eye, FileCheck } from "lucide-react";
import moment from "moment";
import { isPengajuanPath } from "../satkerHooks";
import { statusColorClass, statusColorText, statusLabel } from "../constants/styleConstants";

export default function SatkerTable({
  columns,
  dataTable,
  location,
  userData,
  handleSortChange,
  sortBy,
  sortDir,
  openEditModal,
  openPengujianModal,
  openDetailModal,
  openPDFModal,
}) {
  const isPengajuan = isPengajuanPath(location.pathname);
  const role = userData?.role;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table sx={{ minWidth: 650, borderCollapse: "collapse" }} aria-label="interactive data table">
        
        {/* HEADER */}
        <TableHeader sx={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <TableRow>
            {columns
              .filter((col) => !(col.hiddenInArsip && !isPengajuan))
              .map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  onClick={() => col.sortable && handleSortChange(col.key)}
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "16px 12px",
                    cursor: col.sortable ? "pointer" : "default",
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel active={sortBy === col.key} direction={sortDir}>
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {dataTable.map((row, index) => (
            <TableRow
              key={index}
              className="transition-all duration-200 hover:bg-blue-50/50 border-b border-gray-100 last:border-none"
            >
              {columns
                .filter((col) => !(col.hiddenInArsip && !isPengajuan))
                .map((col) => {
                  
                  // 1. Kolom No. SPP
                  if (col.key === "spp_number") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {row?.no_spp ?? "-"}
                      </TableCell>
                    );
                  }

                  // 2. Kolom Tanggal Pengiriman
                  if (col.key === "created_at") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {row?.[col.key] ? moment(row[col.key]).format("YYYY/MM/DD") : "-"}
                      </TableCell>
                    );
                  }

                  // 3. Kolom Revisi
                  if (col.key === "revisi") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {row?.[col.key] ?? "-"}
                      </TableCell>
                    );
                  }

                  // 4. Kolom Status
                  if (col.key === "status") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px" }}>
                        <div className={`${statusColorClass(row?.[col.key])} rounded-lg p-1 inline-block`}>
                          <span className={`px-2 py-1 rounded text-sm whitespace-nowrap ${statusColorText(row?.[col.key])}`}>
                            {statusLabel(row?.[col.key])}
                          </span>
                        </div>
                      </TableCell>
                    );
                  }

                  // 5. Kolom Catatan
                  if (col.key === "catatan") {
                    const feedback = row?.feedback;
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {feedback === "null" || feedback == null ? (
                          "-"
                        ) : feedback.length > 25 ? (
                          <span className="px-2 py-1 rounded text-white text-xs font-medium bg-yellow-500 whitespace-nowrap">
                            ...Catatan di Detail
                          </span>
                        ) : (
                          feedback
                        )}
                      </TableCell>
                    );
                  }

                  // 6. Kolom Kelengkapan
                  if (col.key === "kelengkapan") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {row?.total_kelengkapan ?? "-"}
                      </TableCell>
                    );
                  }

                  // 7. Kolom Dokumen (Mencegah Error Object)
                  if (col.key === "document" || col.key === "document_spm" || col.key === "document_sp2d") {
                    const docObject = row[col.key];
                    let labelText = "Klik untuk lihat";
                    
                    if (col.key === "document") labelText = `Lihat SPP ${row.no_spp || ""}`;
                    if (col.key === "document_spm") labelText = `Lihat SPM ${row.no_spp || ""}`;
                    if (col.key === "document_sp2d") labelText = `Lihat SP2D ${row.no_spp || ""}`;

                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {docObject && typeof docObject.url === "string" ? (
                          <span
                            onClick={() => openPDFModal(docObject.url)}
                            className="text-blue-500 hover:text-blue-700 underline cursor-pointer font-medium whitespace-nowrap"
                          >
                            {labelText}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    );
                  }

                  // 8. Kolom Jumlah Halaman
                  if (col.key === "jml_hal") {
                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                        {row.jml_hal ?? "-"}
                      </TableCell>
                    );
                  }

                  // 9. Kolom Action (Menyamping / Flex-Row)
                  if (col.key === "action") {
                    // Logika role yang diambil dari kode lama Anda
                    const showEditButton = (isPengajuan && role === "user" && row.status !== "approved" && row.status !== "sp2d") || !isPengajuan;
                    const showPengujianButton = isPengajuan && (role === "admin" || role === "pic") && row.status !== "sp2d";
                    const showDetailButton = isPengajuan && (row.status === "approved" || row.status === "fix" || row.status === "reject" || row.status === "sp2d");

                    return (
                      <TableCell key={col.key} align="center" sx={{ padding: "12px 16px" }}>
                        <div className="flex flex-row justify-center items-center gap-2">
                          
                          {showEditButton && (
                            <button
                              title="Edit"
                              className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-200"
                              onClick={() => openEditModal(row)}
                            >
                              <Edit2 size={16} />
                            </button>
                          )}

                          {showPengujianButton && (
                            <button
                              title={row.status === "approved" ? "Ubah Status" : "Pengujian"}
                              className="p-2 rounded-md bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-orange-200"
                              onClick={() => openPengujianModal(row)}
                            >
                              <FileCheck size={16} />
                            </button>
                          )}

                          {showDetailButton && (
                            <button
                              title="Detail"
                              className="p-2 rounded-md bg-lime-50 text-lime-600 hover:bg-lime-500 hover:text-white transition-colors border border-lime-200"
                              onClick={() => openDetailModal(row)}
                            >
                              <Eye size={16} />
                            </button>
                          )}

                        </div>
                      </TableCell>
                    );
                  }

                  // 10. Default Fallback untuk kolom lainnya
                  return (
                    <TableCell key={col.key} align="center" sx={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                      {typeof row[col.key] === "object" && row[col.key] !== null 
                        ? "-" 
                        : row[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}