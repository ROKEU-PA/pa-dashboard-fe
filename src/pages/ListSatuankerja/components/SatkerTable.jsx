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
import { useNavigate } from "react-router-dom";
import { isPengajuanPath } from "../satkerHooks";
import {
  statusColorClass,
  statusColorText,
  statusLabel,
} from "../constants/styleConstants";

    export default function SatkerTable({
      // Props lama tetap dipertahankan
      columns = [],
      dataTable = [],
      location,
      userData,
      handleSortChange,
      sortBy,
      sortDir,
      openEditModal,

      jumlahDiprosesPIC = 0,
      jumlahPerluDiperbaiki = 0,
      jumlahPerluDiperbaikiPAPIC = 0,

      canSubmitTest,
      canSubmitApprove,
      canSubmitFix,
      activeTab = "diproses",
      canAddSubmission,

      picSummaryNote = "",
      userSummaryNote = "",
      onOpenPembatasanInfo,
    }) {
  const navigate = useNavigate();

  const pathname =
    location?.pathname ||
    (typeof window !== "undefined" ? window.location.pathname : "");

  const isPengajuan = isPengajuanPath(pathname);

  const role = String(
    userData?.role ||
      userData?.rolename ||
      userData?.user?.role ||
      ""
  )
    .toLowerCase()
    .trim();

  const isPIC = role.includes("pic") || role === "admin";
  const isUser = role === "user";

  const jumlahDiproses = Math.max(
    0,
    Number(jumlahDiprosesPIC) || 0
  );

  const jumlahRevisiPIC = Math.max(
    0,
    Number(jumlahPerluDiperbaiki) || 0
  );

  const jumlahRevisiUser = Math.max(
    0,
    Number(jumlahPerluDiperbaikiPAPIC) || 0
  );

  /*   * Jika API sudah mengirim boolean, gunakan nilai API.
   * Jika belum, gunakan aturan fallback jumlah dokumen > 10.
   */
const isFixStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  return (
    value === "diproses (butuh perbaikan)" ||
    value === "fix" ||
    value.includes("butuh perbaikan") ||
    value.includes("perlu diperbaiki")
  );
};

const isDiprosesLengkapStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  return (
    value === "approved" ||
    value === "approve" ||
    value.includes("diproses lengkap")
  );
};

const tambahPengajuanTidakDiizinkan =
  typeof canAddSubmission === "boolean"
    ? !canAddSubmission
    : jumlahRevisiUser > 10;

const tambahPengajuanDisabled =
  isPengajuan &&
  isUser &&
  tambahPengajuanTidakDiizinkan;

const pesanPembatasanPIC = {
  judul: "Pengujian SPP Dinonaktifkan",
  pesan:
    String(picSummaryNote || "").trim() ||
    `Terdapat ${jumlahDiproses} SPP berstatus Diproses. Cocokkan data SPP dengan My Interest. Jika SPP sudah selesai diproses dan datanya sesuai, ubah status Diproses menjadi SP2D terlebih dahulu. Pengujian SPP dapat digunakan kembali setelah memenuhi ketentuan sistem.`,
  jumlahDiproses,
  jumlahRevisiPIC,
};

const pesanPembatasanUser = {
  judul: "Tambah Pengajuan Dinonaktifkan",
  pesan:
    String(userSummaryNote || "").trim() ||
    `Terdapat ${jumlahRevisiUser} SPP berstatus Perlu Diperbaiki yang diperbarui oleh PA PIC. Perbaiki SPP tersebut terlebih dahulu sebelum membuat pengajuan baru.`,
  jumlah: jumlahRevisiUser,
};

  // Badge jumlah revisi per dokumen
  const renderRevisiBadge = (revisiCount, statusDokumen) => {
    const count = Number(revisiCount || 0);

    if (!count) {
      return (
        <span className="font-medium text-slate-300 dark:text-slate-600">
          —
        </span>
      );
    }

    const normalizedStatus = String(statusDokumen || "")
      .trim()
      .toLowerCase();

    const isNeedsFix =
      normalizedStatus !== "approved" &&
      normalizedStatus !== "sp2d";

    return (
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full
          border px-2.5 py-1 text-[10px] font-bold
          shadow-sm transition-all duration-300 sm:text-xs
          ${
            isNeedsFix
              ? "animate-pulse border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
              : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
          }
        `}
      >
        {isNeedsFix ? (
          <BellRing size={12} className="animate-bounce" />
        ) : (
          <Check
            size={12}
            className="text-emerald-500 dark:text-emerald-400"
          />
        )}
        <span>{count}x Revisi</span>
      </div>
    );
  };

  // Badge kelengkapan dokumen
  const renderKelengkapanBadge = (kelengkapanStr) => {
    if (
      !kelengkapanStr ||
      typeof kelengkapanStr !== "string" ||
      !kelengkapanStr.includes("/")
    ) {
      return (
        <span className="text-xs font-medium text-slate-400 dark:text-slate-600">
          -
        </span>
      );
    }

    const [checkedStr, totalStr] = kelengkapanStr.split("/");
    const checkedCount = parseInt(checkedStr, 10);
    const totalCount = parseInt(totalStr, 10);

    const isComplete =
      checkedCount === totalCount && totalCount > 0;
    const isZero = checkedCount === 0;

    return (
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full
          border px-2.5 py-1 text-[10px] font-bold sm:text-xs
          ${
            isComplete
              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              : isZero
                ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                : "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
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

  // Sembunyikan kolom sesuai halaman
  const visibleColumns = (columns || []).filter(
    (col) =>
      !(
        (col.hiddenInArsip && !isPengajuan) ||
        col.hiddenInPengajuan
      )
  );

  // Tooltip informasi pembatasan berwarna oranye
  const renderTooltip = (message) => (
    <div
      role="tooltip"
      className="
        pointer-events-none invisible absolute left-1/2 top-full
        z-50 mt-2 w-72 max-w-[calc(100vw-2rem)]
        -translate-x-1/2 rounded-xl
        border border-orange-200
        bg-orange-50 px-3 py-2
        text-left text-xs font-medium
        leading-relaxed text-orange-800
        shadow-lg shadow-orange-200/40
        opacity-0 transition-all duration-150
        group-hover:visible group-hover:opacity-100
        dark:border-orange-500/30
        dark:bg-[#2b1b10]
        dark:text-orange-300
      "
    >
      <div className="mb-1 flex items-center gap-1.5 font-bold">
        <AlertCircle size={14} />
        Informasi Pembatasan
      </div>
      <p>{message}</p>
    </div>
  );

  return (
    <>
      <div
        className="
          table-scroll mt-4 w-full overflow-x-auto rounded-[20px]
          border border-slate-100 bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.03)]
          backdrop-blur-md transition-colors duration-300
          dark:border-white/10 dark:bg-[#111C30]/80
          dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        "
      >
        <Table aria-label="interactive data table">
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  onClick={() =>
                    col.sortable && handleSortChange(col.key)
                  }
                  className={`
                    whitespace-nowrap px-4 py-4 text-[10px]
                    font-bold uppercase tracking-wider
                    text-slate-500 transition-colors dark:text-slate-400
                    sm:text-xs
                    ${
                      col.sortable
                        ? "group cursor-pointer select-none hover:text-blue-500 dark:hover:text-blue-400"
                        : "cursor-default"
                    }
                  `}
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

          <TableBody>
            {(dataTable || []).map((row, index) => (
              <TableRow
                key={
                  row?.nospp ??
                  row?.no_spp ??
                  row?.id ??
                  index
                }
                className="
                  group border-b border-slate-100
                  transition-colors duration-200
                  last:border-none hover:bg-slate-50/80
                  dark:border-white/10 dark:hover:bg-white/5
                "
              >
                {visibleColumns.map((col) => {
                  // Nomor SPP
                  if (col.key === "spp_number") {
                    const nomorSPP =
                      row?.nospp ??
                      row?.no_spp ??
                      row?.no_spp_ ??
                      row?.nomor_spp ??
                      row?.nomor_spp_;

                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="
                          whitespace-nowrap px-4 py-3.5
                          text-xs font-bold text-slate-700
                          dark:text-gray-200 sm:text-sm
                        "
                      >
                        {nomorSPP ?? "-"}
                      </TableCell>
                    );
                  }

                  // Tanggal dibuat
                  if (col.key === "created_at") {
                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="
                          whitespace-nowrap px-4 py-3.5
                          text-xs font-medium text-slate-600
                          dark:text-gray-300 sm:text-sm
                        "
                      >
                        {row?.[col.key]
                          ? moment(row[col.key]).format("YYYY/MM/DD")
                          : "-"}
                      </TableCell>
                    );
                  }

                  // Status dokumen
                  if (col.key === "status") {
                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="whitespace-nowrap px-4 py-3.5"
                      >
                        <div
                          className={`
                            inline-flex items-center justify-center
                            rounded-full border px-3 py-1
                            text-[10px] font-bold shadow-sm
                            transition-all sm:text-xs
                            ${statusColorClass(row?.[col.key])}
                            ${statusColorText(row?.[col.key])}
                            dark:border-opacity-30 dark:bg-opacity-20
                          `}
                        >
                          {statusLabel(row?.[col.key])}
                        </div>
                      </TableCell>
                    );
                  }

                  // Kelengkapan
                  if (col.key === "kelengkapan") {
                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="whitespace-nowrap px-4 py-3.5"
                      >
                        {renderKelengkapanBadge(
                          row?.total_kelengkapan ??
                            row?.totalkelengkapan_ ??
                            row?._totalkelengkapan_
                        )}
                      </TableCell>
                    );
                  }

                  // Revisi per dokumen
                  if (col.key === "revisi") {
                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="whitespace-nowrap px-4 py-3.5"
                      >
                        {renderRevisiBadge(
                          row?.revisi ?? row?.rev,
                          row?.status
                        )}
                      </TableCell>
                    );
                  }

                  // Kolom aksi
                  if (col.key === "action") {
                    const normalizedStatus = String(
                      row?.status_ ?? row?.status ?? ""
                    )
                      .trim()
                      .toLowerCase();

                    // Tombol Edit untuk User
                    const showEditButton =
                      (isUser || isPIC) &&
                      normalizedStatus !== "approved" &&
                      normalizedStatus !== "sp2d";

                    // Tombol Pengujian untuk PIC
                    // Kondisi tampil TIDAK bergantung pada pembatasan jumlah SPP.
                    const showPengujianButton =
                      isPengajuan &&
                      isPIC &&
                      normalizedStatus !== "sp2d";

                    const showDocumentButton = showPengujianButton;

                    const rowStatus = row?.status_ ?? row?.status ?? "";


                    const isFixRow = isFixStatus(rowStatus);

                    // Hanya mengatur klik, bukan mengatur tampilan tombol.
                    const dokumenDisabled =
                      showPengujianButton &&
                      (
                        (isFixRow && canSubmitFix === false) ||
                        (isDiprosesLengkapStatus(rowStatus) && canSubmitApprove === false)
                      );

                    const dataPembatasan = pesanPembatasanPIC;

                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="px-4 py-3.5"
                      >
                        <div className="flex flex-row items-center justify-center gap-2.5">
                          {showEditButton && (
                            <button
                              type="button"
                              title="Edit"
                              className="
                                rounded-xl border border-blue-200
                                bg-blue-50 p-2 text-blue-600
                                shadow-sm transition-all duration-200
                                hover:-translate-y-0.5 hover:bg-blue-600
                                hover:text-white hover:shadow-md
                                dark:border-blue-500/20
                                dark:bg-blue-500/10 dark:text-blue-400
                                dark:hover:bg-blue-500 dark:hover:text-white
                              "
                              onClick={() => openEditModal(row)}
                            >
                              <Edit2 size={16} strokeWidth={2.5} />
                            </button>
                          )}

                            {showDocumentButton && (
                              <div className="relative inline-flex group">
                                <button
                                  type="button"
                                  title={
                                    dokumenDisabled
                                      ? "Pengujian tidak dapat dibuka"
                                      : "Pengujian SPP"
                                  }
                                  aria-disabled={dokumenDisabled}
                                  className={`
                                    rounded-xl border p-2 transition-all duration-200
                                    ${
                                      dokumenDisabled
                                        ? "cursor-not-allowed border-orange-300 bg-orange-100 text-orange-500"
                                        : "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white"
                                    }
                                  `}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    // BLOKIR sebelum navigate dipanggil.
                                    if (dokumenDisabled) {
                                      onOpenPembatasanInfo?.(pesanPembatasanPIC);
                                      return;
                                    }

                                    navigate(`/pengajuan/pengujian/${row.no_spp_}`, {
                                      state: { row },
                                    });
                                  }}
                                >
                                  <FileCheck size={16} strokeWidth={2.5} />
                                </button>

                                {dokumenDisabled &&
                                  renderTooltip(pesanPembatasanPIC.pesan)}
                              </div>
                            )}

                          <button
                            type="button"
                            title="Detail"
                            className="
                              rounded-xl border border-lime-200
                              bg-lime-50 p-2 text-lime-600
                              shadow-sm transition-all duration-200
                              hover:-translate-y-0.5 hover:bg-lime-500
                              hover:text-white hover:shadow-md
                              dark:border-lime-500/20
                              dark:bg-lime-500/10 dark:text-lime-400
                              dark:hover:bg-lime-500 dark:hover:text-white
                            "
                            onClick={() =>
                              navigate(
                                `/pengajuan/detail/${
                                  row?.nospp ?? row?.no_spp
                                }`,
                                { state: { row } }
                              )
                            }
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </TableCell>
                    );
                  }

                  // Kolom lainnya
                  return (
                    <TableCell
                      key={col.key}
                      align="center"
                      className="
                        whitespace-nowrap px-4 py-3.5
                        text-xs font-medium text-slate-600
                        dark:text-gray-300 sm:text-sm
                      "
                    >
                      {typeof row?.[col.key] === "object" &&
                      row?.[col.key] !== null
                        ? "-"
                        : row?.[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
