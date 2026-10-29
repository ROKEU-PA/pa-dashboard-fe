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
  pesan: "Anda harus melakukan upload perbaikan SPP terlebih dahulu, agar dapat Tambah Pengajuan Baru.",
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

  return (
    <div
      className="
        inline-flex items-center gap-1.5 rounded-full
        border border-orange-200 bg-orange-50
        px-2.5 py-1 text-[10px] font-bold
        text-orange-600 shadow-sm
        transition-all duration-300 sm:text-xs
        dark:border-orange-500/20
        dark:bg-orange-500/10 dark:text-orange-400
      "
    >
      <BellRing
        size={12}
        className="text-orange-500 dark:text-orange-400"
      />

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


// Tooltip informasi pembatasan dengan tampilan abu-abu
const renderTooltip = (message) => (
  <div
    role="tooltip"
    className="
      pointer-events-none invisible absolute
      top-full left-1/2 z-[99999] mt-2
      w-48 max-w-[calc(100vw-2rem)]
      -translate-x-1/2
      rounded-lg
      border border-orange-200
      bg-orange-50 px-2.5 py-2
      text-left text-[10px]
      leading-snug text-orange-900
      shadow-md shadow-orange-900/10
      opacity-0 transition-all duration-150
      group-hover:visible group-hover:opacity-100
      dark:border-orange-700
      dark:bg-orange-950
      dark:text-orange-100
    "
  >
    <div className="mb-1 flex items-center gap-1 font-semibold text-orange-700 dark:text-orange-300">
      <AlertCircle size={11} className="shrink-0" />
      Informasi Pembatasan
    </div>

    <p className="break-words">{message}</p>
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
                row?.id ??
                row?.spp_number ??
                row?._id_ ??
                row?._spp_number_ ??
                row?._nospp_ ??
                row?._no_spp_ ??
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
                    row?.spp_number ??
                    row?._spp_number_ ??
                    row?.nospp ??
                    row?.no_spp ??
                    row?._no_spp_ ??
                    row?.nomor_spp ??
                    row?._nomor_spp__;

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
                    row?.status ??
                    row?._status_ ??
                    row?._status__ ??
                    row?._status_spp_ ??
                    row?._nama_status_ ??
                    ""
                  )
                    .trim()
                    .toLowerCase();

                    // Tombol Edit untuk User
                    const showEditButton =
                      (isUser &&
                        normalizedStatus !== "approved" &&
                        normalizedStatus !== "sp2d") ||
                      (isPIC && normalizedStatus === "approved");

                    // Kondisi tampil TIDAK bergantung pada pembatasan jumlah SPP.
                    const showPengujianButton =
                      isPengajuan &&
                      isPIC &&
                      normalizedStatus !== "sp2d";

                    const showDocumentButton = showPengujianButton;

                // Normalisasi status untuk mendeteksi variasi penulisan.
                const normalizedStatusKey = normalizedStatus.replace(/[\s_-]+/g, "");

                // Status Diperbaiki selalu nonaktif.
                const isFixRow = [
                  "fix",
                  "diperbaiki",
                  "perludiperbaiki",
                  "perluperbaikan",
                  "perbaikan",
                ].includes(normalizedStatusKey);

                // Status Baru Ditambahkan.
                const isNewRow = [
                  "baru",
                  "baruditambahkan",
                  "new",
                  "newlyadded",
                ].includes(normalizedStatusKey);

              const approveAllowed = canSubmitApprove === true;

              const isLengkapMoreThanTen = jumlahDiproses > 10;

              const dokumenDisabled =
                isPIC &&
                isLengkapMoreThanTen &&
                (isFixRow || isNewRow);

                    return (
                      <TableCell
                        key={col.key}
                        align="center"
                        className="px-4 py-3.5"
                      >
                        <div className="flex flex-row items-center justify-center gap-2.5">
                          {showEditButton && !isPIC && (
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
                                  disabled={dokumenDisabled}
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
                                        ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
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

                                  const noSPP = String(
                                    row?.spp_number ??
                                    row?.no_spp ??
                                    row?.nospp ??
                                    row?.nomor_spp ??
                                    ""
                                  ).trim();

                                  if (!noSPP) {
                                    console.error("Nomor SPP tidak ditemukan:", row);
                                    return;
                                  }

                                  navigate(
                                    `/pengajuan/pengujian/${encodeURIComponent(noSPP)}`,
                                    {
                                      state: { row },
                                    }
                                  );
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
                                row?.spp_number ?? row?.nospp ?? row?.no_spp
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
