import React from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import TableSortLabel from "@/components/TableSortLabel";
import {
  AlertCircle,
  BellRing,
  Check,
  CheckCircle2,
  Edit2,
  Eye,
  FileCheck,
  XCircle,
} from "lucide-react";
import moment from "moment";
import { isPengajuanPath } from "../satkerHooks";
import {
  statusColorClass,
  statusColorText,
  statusLabel,
} from "../constants/styleConstants";
import { useNavigate } from "react-router-dom";

export default function SatkerTable({
  columns,
  dataTable,
  location,
  userData,
  handleSortChange,
  sortBy,
  sortDir,
  openEditModal,
}) {
  const isPengajuan = isPengajuanPath(location.pathname);
  const role = userData?.role;
  const navigate = useNavigate();

  const renderRevisiBadge = (revisiCount, statusDokumen) => {
    if (!revisiCount || revisiCount === 0) {
      return <span className="text-slate-300 dark:text-slate-600 font-medium">—</span>;
    }
    const isNeedsFix = statusDokumen !== "approved" && statusDokumen !== "sp2d";

    return (
      <div
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border shadow-sm transition-all duration-300
          ${
            isNeedsFix
              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 animate-pulse"
              : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
          }
        `}
      >
        {isNeedsFix ? (
          <BellRing size={12} className="animate-bounce" />
        ) : (
          <Check size={12} className="text-emerald-500 dark:text-emerald-400" />
        )}
        <span>{revisiCount}x Revisi</span>
      </div>
    );
  };

  const renderKelengkapanBadge = (kelengkapanStr) => {
    if (
      !kelengkapanStr ||
      typeof kelengkapanStr !== "string" ||
      !kelengkapanStr.includes("/")
    ) {
      return <span className="text-slate-400 dark:text-slate-600 text-xs font-medium">-</span>;
    }

    const [checkedStr, totalStr] = kelengkapanStr.split("/");
    const checkedCount = parseInt(checkedStr, 10);
    const totalCount = parseInt(totalStr, 10);

    const isComplete = checkedCount === totalCount && totalCount > 0;
    const isZero = checkedCount === 0;

    return (
      <div
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border
          ${
            isComplete
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : isZero
                ? "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
                : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
          }
        `}
      >
        {isComplete ? (
          <CheckCircle2 size={14} />
        ) : isZero ? (
          <XCircle size={14} />
        ) : (
          <AlertCircle size={14} />
        )}
        <span>{kelengkapanStr}</span>
      </div>
    );
  };

  return (
    // Wadah Luar: Sama persis kayak FilterSection biar lebarnya rata dan estetik
    <div className="w-full mt-4 overflow-x-auto rounded-[20px] bg-white dark:bg-[#111C30]/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/10 transition-colors duration-300 table-scroll">
      
      {/* Table Utama tanpa sx inline style */}
      <Table aria-label="interactive data table">
        
        {/* HEADER */}
        {/* TableHeader udah diatur di komponen bawaan, kita cuma butuh manggil aja */}
        <TableHeader>
          <TableRow>
            {columns
              .filter(
                (col) =>
                  !(
                    (col.hiddenInArsip && !isPengajuan) ||
                    col.hiddenInPengajuan
                  ),
              )
              .map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  onClick={() => col.sortable && handleSortChange(col.key)}
                  // Styling Header Full Tailwind
                  className={`py-4 px-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap transition-colors ${
                    col.sortable ? "cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 select-none group" : "cursor-default"
                  }`}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortDir}
                      className="group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    >
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
              // Styling Baris Hover
              className="transition-colors duration-200 hover:bg-slate-50/80 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/10 last:border-none group"
            >
              {columns
                .filter(
                  (col) =>
                    !(
                      (col.hiddenInArsip && !isPengajuan) ||
                      col.hiddenInPengajuan
                    ),
                )
                .map((col) => {
                  // 1. Kolom No. SPP
                  if (col.key === "spp_number") {
                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-200 whitespace-nowrap">
                        {row?.no_spp ?? "-"}
                      </TableCell>
                    );
                  }

                  // 2. Kolom Tanggal Pengiriman
                  if (col.key === "created_at") {
                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 whitespace-nowrap">
                        {row?.[col.key] ? moment(row[col.key]).format("YYYY/MM/DD") : "-"}
                      </TableCell>
                    );
                  }

                  // 4. Kolom Status
                  if (col.key === "status") {
                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`inline-flex items-center justify-center px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full border shadow-sm transition-all ${statusColorClass(row?.[col.key])} ${statusColorText(row?.[col.key])} dark:bg-opacity-20 dark:border-opacity-30`}>
                          {statusLabel(row?.[col.key])}
                        </div>
                      </TableCell>
                    );
                  }

                  // 6. Kolom Kelengkapan
                  if (col.key === "kelengkapan") {
                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4 whitespace-nowrap">
                        {renderKelengkapanBadge(row?.total_kelengkapan)}
                      </TableCell>
                    );
                  }

                  // Kolom Revisi
                  if (col.key === "revisi") {
                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4 whitespace-nowrap">
                        {renderRevisiBadge(row?.revisi, row?.status)}
                      </TableCell>
                    );
                  }

                  // 9. Kolom Action (Menyamping / Flex-Row)
                  if (col.key === "action") {
                    const showEditButton = role === "user" && row.status !== "approved" && row.status !== "sp2d";
                    const showPengujianButton = isPengajuan && (role === "admin" || role === "pic") && row.status !== "sp2d";
                    const showDetailButton = true;

                    return (
                      <TableCell key={col.key} align="center" className="py-3.5 px-4">
                        <div className="flex flex-row justify-center items-center gap-2.5">
                          {showEditButton && (
                            <button
                              title="Edit"
                              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200 border border-blue-200 dark:border-blue-500/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                              onClick={() => openEditModal(row)}
                            >
                              <Edit2 size={16} strokeWidth={2.5} />
                            </button>
                          )}

                          {showPengujianButton && (
                            <button
                              title={row.status === "approved" ? "Ubah Status" : "Pengujian"}
                              className="p-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all duration-200 border border-orange-200 dark:border-orange-500/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                              onClick={() => navigate(`/pengajuan/pengujian/${row.no_spp}`, { state: { row } })}
                            >
                              <FileCheck size={16} strokeWidth={2.5} />
                            </button>
                          )}

                          {showDetailButton && (
                            <button
                              title="Detail"
                              className="p-2 rounded-xl bg-lime-50 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400 hover:bg-lime-500 hover:text-white dark:hover:bg-lime-500 dark:hover:text-white transition-all duration-200 border border-lime-200 dark:border-lime-500/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                              onClick={() => navigate(`/pengajuan/detail/${row.no_spp}`, { state: { row } })}
                            >
                              <Eye size={16} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    );
                  }

                  // 10. Default Fallback untuk kolom lainnya
                  return (
                    <TableCell key={col.key} align="center" className="py-3.5 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-300 whitespace-nowrap">
                      {typeof row[col.key] === "object" && row[col.key] !== null ? "-" : (row[col.key] ?? "-")}
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