import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiRequest } from "@/services/APIHelper";
import Dialog from "@/components/Dialog";
import { AppContext } from "@/contexts/AppContext";
import {
  AlertCircle,
  FileWarning,
  Loader2,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const PAGE_SIZE = 5;
const MAX_PENDING = 10;

/* =========================================================
   HELPERS
========================================================= */

const firstDefined = (obj, keys, fallback = undefined) => {
  for (const key of keys) {
    if (
      obj?.[key] !== undefined &&
      obj?.[key] !== null &&
      obj?.[key] !== ""
    ) {
      return obj[key];
    }
  }

  return fallback;
};

const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\\\_-]+/g, "");

const getStatus = (doc) =>
  normalizeStatus(
    firstDefined(
      doc,
      [
        "status_",
        "status",
        "status_spp",
        "nama_status",
        "status_name",
      ],
      ""
    )
  );

const isFix = (doc) =>
  [
    "fix",
    "diperbaiki",
    "telahdiperbaiki",
    "perludiperbaiki",
    "perluperbaikan",
    "perbaikan",
  ].includes(getStatus(doc));

const isApproved = (doc) =>
  [
    "approved",
    "diproses",
    "diproseslengkap",
  ].includes(getStatus(doc));

const getRevision = (doc) =>
  Number(
    firstDefined(
      doc,
      ["rev", "revisi", "revision"],
      0
    )
  ) || 0;

const getUpdaterValue = (doc) =>
  firstDefined(
    doc,
    [
      "update_by",
      "updated_by",
      "diperbaiki_oleh",
      "updated_by_name",
      "update_by_name",
    ],
    ""
  );

const getUpdater = (doc) => {
  const value = getUpdaterValue(doc);

  const name =
    value && typeof value === "object"
      ? value.name ??
        value._name_ ??
        value._full_name_ ??
        value._username_ ??
        ""
      : value;

  return String(name ?? "").trim().toUpperCase();
};

const getUpdaterLabel = (doc) => {
  const value = getUpdaterValue(doc);

  if (value && typeof value === "object") {
    return (
      value.name ??
      value._name_ ??
      value.full_name ??
      value._full_name_ ??
      value.username ??
      value._username_ ??
      "-"
    );
  }

  return value || "-";
};

const getField = (doc, keys, fallback = "-") =>
  firstDefined(doc, keys, fallback);

const getSummaryData = (response) => {
  const source = response?._data ?? response ?? {};

  const body =
    source?.success !== undefined
      ? source
      : source?.data?.success !== undefined
        ? source.data
        : source;

  // Jika response sudah berupa objek pagination.
  if (
    body?.current_page !== undefined &&
    Array.isArray(body?.data)
  ) {
    return body;
  }

  // Jika response masih dibungkus dalam data.
  if (
    body?.data?.current_page !== undefined &&
    Array.isArray(body?.data?.data)
  ) {
    return body.data;
  }

  return body?.data ?? body ?? {};
};

const getSummaryList = (summary, keys) => {
  const list = firstDefined(summary, keys, summary);

  if (Array.isArray(list)) {
    return list;
  }

  if (Array.isArray(list?.data)) {
    return list.data;
  }

  if (Array.isArray(list?.data?.data)) {
    return list.data.data;
  }

  return [];
};

const getSummaryTotal = (
  summary,
  keys,
  fallback = 0
) => {
  const value = Number(
    firstDefined(summary, keys, fallback)
  );

  return Number.isFinite(value) ? value : fallback;
};

const getAccessToken = () => {
  try {
    const auth = JSON.parse(
      sessionStorage.getItem("auth") || "null"
    );

    return (
      auth?.accessToken ||
      auth?.access_token ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token") ||
      null
    );
  } catch {
    return (
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token") ||
      null
    );
  }
};

const formatDate = (value) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const checkResponse = (response, message) => {
  if (response?.success === false) {
    throw new Error(
      response?.message || message
    );
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PendingDocumentsModal({
  open,
  onClose,
  code,
  onSummaryChange,
}) {
  const { userData } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState("diproses");
  const [page, setPage] = useState(1);

  const [picSummary, setPicSummary] = useState({
    totalDiproses: 0,
    totalFix: 0,
    totalFixBackend: 0,
    listDiproses: [],
    listFix: [],
    canSubmitApprove: null,
    canSubmitFix: null,
    note: "",
  });

  const [userSummary, setUserSummary] = useState({
    totalPerluDiperbaiki: 0,
    listPerluDiperbaiki: [],
    canAddSubmission: null,
    note: "",
  });

  const lastRequestKey = useRef("");
  const callbackRef = useRef(onSummaryChange);
  const activeTabRef = useRef(activeTab);
  const mountedRef = useRef(false);

  useEffect(() => {
    callbackRef.current = onSummaryChange;
  }, [onSummaryChange]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* =========================================================
     ROLE
  ========================================================= */

  const role = String(
    firstDefined(
      userData,
      ["role", "role_name", "rolename"],
      firstDefined(
        userData?.user,
        ["role", "role_name", "rolename"],
        ""
      )
    )
  )
    .trim()
    .toLowerCase();

  const isPic = [
    "pic",
    "admin",
    "pa pic",
  ].includes(role);

  /* =========================================================
     FETCH SUMMARY
  ========================================================= */

  const fetchData = useCallback(
    async (force = false) => {
      if (!open) return;

      const requestKey = `${code ?? ""}-${
        isPic ? "PIC" : "USER"
      }`;

      if (
        !force &&
        lastRequestKey.current === requestKey
      ) {
        return;
      }

      lastRequestKey.current = requestKey;

      setLoading(true);
      setErrorMessage("");

      try {
        const token = getAccessToken();

        if (!token) {
          throw new Error(
            "Token login tidak ditemukan. Silakan login kembali."
          );
        }

        // Kode biro dikirim sebagai parameter ke API.
        const biroCode = String(code ?? "").trim();

        if (!biroCode) {
          throw new Error("Kode biro tidak ditemukan.");
        }

        const encodedBiroCode = encodeURIComponent(biroCode);

        /* =====================================================
           PIC
        ===================================================== */

        if (isPic) {
          const [
            approveResponse,
            picResponse,
          ] = await Promise.all([
            apiRequest({
              url: `/archive/approve-list?biro_code=${encodedBiroCode}`,
              token,
            }),

            apiRequest({
              url: `/archive/pic-summary?biro_code=${encodedBiroCode}`,
              token,
            }),
          ]);

          checkResponse(
            approveResponse,
            "Gagal mengambil daftar SPP approved."
          );

          checkResponse(
            picResponse,
            "Gagal mengambil daftar SPP yang perlu diperbaiki."
          );

          const approveSummary =
            getSummaryData(approveResponse);

          const summary =
            getSummaryData(picResponse);

 
          /* ================================================
            PIC - APPROVED / DIPROSES
          ================================================ */

          const approvedKeys = [
            "list_approved",
            "list_approve",
            "list_diproses",
            "list_perlu_proses",
            "list_process",
          ];

          // Ambil data Approved halaman pertama
          const approvedList = firstDefined(
            approveSummary,
            approvedKeys,
            approveSummary
          );

          const rawDiproses = getSummaryList(
            approveSummary,
            approvedKeys
          );

          // Ambil informasi jumlah halaman dari Backend
          const lastApprovedPage = Math.max(
            1,
            Number(
              firstDefined(
                approvedList,
                ["last_page", "_last_page_", "lastPage"],
                firstDefined(
                  approveSummary,
                  ["last_page", "_last_page_", "lastPage"],
                  1
                )
              )
            ) || 1
          );

          // Ambil seluruh data dari halaman berikutnya
          for (let page = 2; page <= lastApprovedPage; page++) {
            const pageResponse = await apiRequest({
              url: `/archive/approve-list?biro_code=${encodedBiroCode}&page=${page}`,
              token,
            });

            checkResponse(
              pageResponse,
              `Gagal mengambil daftar SPP Approved halaman ${page}.`
            );

            const pageSummary = getSummaryData(pageResponse);

            const pageData = getSummaryList(
              pageSummary,
              approvedKeys
            );

            rawDiproses.push(...pageData);
          }

          // Tampilkan semua data dari API tanpa filter tambahan
          const filteredDiproses = rawDiproses;

          // Ambil total Approved dari Backend
          const totalDiproses = getSummaryTotal(
            approveSummary,
            [
              "total_approved",
              "total_approve",
              "total_diproses",
              "total",
            ],
            filteredDiproses.length
          );

          /* ================================================
             PIC - FIX / PERLU DIPERBAIKI
          ================================================ */

          const fixKeys = [
            "list_fix",
            "list_fix_not_pic_rev_gt0",
            "listfix_not_pic_revgt0",
            "list_perlu_fix",
            "list_perlu_fix_pic",
            "list_diperbaiki",
          ];

          // Ambil data halaman pertama
            const fixList = firstDefined(
            summary,
            fixKeys,
            summary
          );

          let rawFix = getSummaryList(summary, fixKeys);

          const lastFixPage = Math.max(
            1,
            Number(
              fixList?.last_page ??
              fixList?._last_page_ ??
              fixList?.lastPage ??
              1
            ) || 1
          );

          // Ambil seluruh halaman berikutnya
          for (let page = 2; page <= lastFixPage; page++) {
            const pageResponse = await apiRequest({
              url: `/archive/pic-summary?biro_code=${encodedBiroCode}&page=${page}`,
              token,
            });

            checkResponse(
              pageResponse,
              `Gagal mengambil daftar SPP Fix halaman ${page}.`
            );

            const pageSummary = getSummaryData(pageResponse);

            const pageList = getSummaryList(pageSummary, fixKeys);

            rawFix = [...rawFix, ...pageList];
          }

          // Filter data Fix
          const filteredFix = rawFix.filter(
            (doc) =>
              isFix(doc) &&
              getRevision(doc) > 0 &&
              getUpdater(doc) !== "PA PIC"
          );

          const totalFixBackend = getSummaryTotal(
            summary,
            ["total_fix", "total"],
            filteredFix.length
          );

          const totalFix = totalFixBackend;

          /* ================================================
            ACTION BUTTONS PIC
          ================================================ */

          // APPROVE: mengikuti API approve-list
          const approveActionButtons =
            approveSummary?.action_buttons ?? {};

          const canSubmitApprove =
            typeof approveSummary?.can_submit_approved === "boolean"
              ? approveSummary.can_submit_approved
              : typeof approveActionButtons.submit_approved === "boolean"
                ? approveActionButtons.submit_approved
                : typeof approveActionButtons.submit_approve === "boolean"
                  ? approveActionButtons.submit_approve
                  : false;

          // FIX: mengikuti API pic-summary jika flag tersedia
          const actionButtons =
            summary?.action_buttons ?? {};

          const canSubmitFix =
            typeof summary?.can_submit_fix === "boolean"
              ? summary.can_submit_fix
              : typeof actionButtons?.submit_fix === "boolean"
                ? actionButtons.submit_fix
                : false;

          const nextSummary = {
            totalDiproses,
            totalFix,
            totalFixBackend,
            listDiproses: filteredDiproses,
            listFix: filteredFix,
            canSubmitApprove,
            canSubmitFix,
            note:
              summary?.note ??
              approveSummary?.note ??
              "",
          };

          if (!mountedRef.current) return;

          setPicSummary(nextSummary);

          callbackRef.current?.({
            jumlahDiprosesPIC: totalDiproses,

            jumlahPerluDiperbaiki: totalFix,

            totalDiperbaikiRevGte1: totalFix,

            canSubmitApprove,
            canSubmitFix,

            canSubmitTest:
              activeTabRef.current === "diproses"
                ? canSubmitApprove
                : canSubmitFix,

            canAddSubmission: true,

            activeTab: activeTabRef.current,

            notePIC: nextSummary.note,
          });
        } else {
        const response = await apiRequest({
          url: `/archive/user-summary?biro_code=${encodedBiroCode}`,
          token,
        });

        checkResponse(
          response,
          "Gagal mengambil summary SPP User."
        );

        const summary = getSummaryData(response);

        // Ambil data halaman pertama
        let rawList = getSummaryList(summary, [
          "list_perlu_difix",
        ]);

        // Ambil informasi pagination dari backend
        const pagination =
          summary?.list_perlu_difix ?? summary ?? {};

        const lastPage = Math.max(
          1,
          Number(
            pagination?.last_page ??
            pagination?._last_page_ ??
            pagination?.lastPage ??
            1
          )
        );

        // Ambil seluruh halaman berikutnya
        for (let page = 2; page <= lastPage; page++) {
          const pageResponse = await apiRequest({
            url: `/archive/user-summary?biro_code=${encodedBiroCode}&page=${page}`,
            token,
          });

          checkResponse(
            pageResponse,
            `Gagal mengambil data SPP User halaman ${page}.`
          );

          const pageSummary = getSummaryData(pageResponse);

          const pageList = getSummaryList(pageSummary, [
            "list_perlu_difix",
          ]);

          rawList = [...rawList, ...pageList];
        }

        const filteredUser = rawList.filter(
          (doc) =>
            isFix(doc) &&
            getUpdater(doc) === "PA PIC"
        );

          const total = getSummaryTotal(
            summary,
            ["perlu_difix", "total"],
            filteredUser.length
          );

          const canAddSubmission =
            typeof summary?.can_add_submission === "boolean"
              ? summary.can_add_submission
              : total <= MAX_PENDING;

          const nextSummary = {
            totalPerluDiperbaiki: total,
            listPerluDiperbaiki: filteredUser,
            canAddSubmission,
            note: summary?.note ?? "",
          };

          if (!mountedRef.current) return;

          setUserSummary(nextSummary);

          callbackRef.current?.({
            jumlahPerluDiperbaikiPAPIC: total,
            jumlahPerluDiperbaikiUser: total,
            canAddSubmission,
            activeTab: activeTabRef.current,
            noteUser: nextSummary.note,
          });
        }
      } catch (error) {
        console.error(
          "[PendingDocumentsModal] Gagal mengambil summary:",
          error
        );

        if (!mountedRef.current) return;

        setErrorMessage(
          error?.message ||
            "Gagal memuat summary SPP."
        );
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [open, code, isPic]
  );

  /* =========================================================
     EFFECT FETCH
  ========================================================= */

  useEffect(() => {
    if (!open) {
      lastRequestKey.current = "";
      return;
    }

    fetchData();
  }, [open, fetchData]);

  /* =========================================================
     RESET PAGINATION
  ========================================================= */

  useEffect(() => {
    setPage(1);
  }, [activeTab, open]);

  /* =========================================================
     ACTIVE DATA
  ========================================================= */

  const dataAktif = useMemo(() => {
    if (!isPic) {
      return userSummary.listPerluDiperbaiki;
    }

    return activeTab === "diproses"
      ? picSummary.listDiproses
      : picSummary.listFix;
  }, [
    isPic,
    activeTab,
    picSummary,
    userSummary,
  ]);

  const totalDiprosesPIC =
    picSummary.totalDiproses;

  const totalDiperbaikiPIC =
    picSummary.totalFix;

  const totalDiperbaikiUser =
    userSummary.totalPerluDiperbaiki;

  const tambahPengajuanDisabled =
    userSummary.canAddSubmission === false ||
    totalDiperbaikiUser > MAX_PENDING;

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(dataAktif.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedData = dataAktif.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startData =
    dataAktif.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endData = Math.min(
    currentPage * PAGE_SIZE,
    dataAktif.length
  );

  /* =========================================================
     CHANGE TAB
  ========================================================= */

  const changeTab = (tab) => {
    setActiveTab(tab);

    activeTabRef.current = tab;

    setPage(1);

    if (isPic) {
      const canSubmitTest =
        tab === "diproses"
          ? picSummary.canSubmitApprove
          : picSummary.canSubmitFix;

      callbackRef.current?.({
        jumlahDiprosesPIC:
          totalDiprosesPIC,

        jumlahPerluDiperbaiki:
          totalDiperbaikiPIC,

        totalDiperbaikiRevGte1:
          totalDiperbaikiPIC,

        canSubmitApprove:
          picSummary.canSubmitApprove,

        canSubmitFix:
          picSummary.canSubmitFix,

        canSubmitTest:
          canSubmitTest === true,

        canAddSubmission: true,

        activeTab: tab,

        notePIC: picSummary.note,
      });
    }
  };

  /* =========================================================
     TABLE HEADERS
  ========================================================= */

  const headers =
    isPic && activeTab === "diproses"
      ? [
          "No",
          "No SPP",
          "Status",
          "Tanggal Update",
        ]
      : isPic
        ? [
            "No",
            "No SPP",
            "Revisi",
            "Diubah Oleh",
            "Tanggal Update",
          ]
        : [
            "No",
            "No SPP",
            "Revisi",
            "Tanggal Update",
          ];

  /* =========================================================
     TABLE ROWS
  ========================================================= */

  const renderRows = () =>
    paginatedData.map((doc, index) => {
      const rowNumber =
        (currentPage - 1) * PAGE_SIZE + index + 1;

      const rowKey =
        getField(doc, ["id", "_id"], null) ??
        `${getField(
          doc,
          ["spp_number", "no_spp"],
          "spp"
        )}-${rowNumber}`;

      return (
        <tr
          key={rowKey}
          className="border-b border-slate-100 transition-colors hover:bg-blue-50/50"
        >
          <td className="whitespace-nowrap px-3 py-2 text-center text-xs text-slate-600">
            {rowNumber}
          </td>

          <td className="whitespace-nowrap px-3 py-2 text-center  text-xs font-medium text-slate-700">
            {getField(doc, [
              "spp_number",
              "no_spp",
              "nomor_spp",
            ])}
          </td>

          {isPic && activeTab === "diproses" ? (
            <>
              {/* STATUS */}

              <td className="whitespace-nowrap px-3 py-2 text-center text-xs text-slate-600">
              {isApproved(doc)
                ? "Diproses (Approved)"
                : getField(
                    doc,
                    ["status", "status_spp"],
                    "approved"
                  )}
              </td>

              {/* TANGGAL UPDATE */}

              <td className="whitespace-nowrap px-3 py-2 text-center text-xs text-slate-600">
                {formatDate(
                  getField(
                    doc,
                    ["updated_at", "tgl_update"],
                    "-"
                  )
                )}
              </td>
            </>
          ) : isPic ? (
            <>
              {/* REVISI */}

              <td className="px-3 py-2 text-center text-xs font-semibold text-slate-700">
                {getRevision(doc)}
              </td>

              {/* DIUBAH OLEH */}

              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getUpdaterLabel(doc)}
              </td>

              {/* TANGGAL UPDATE */}

              <td className="whitespace-nowrap px-3 py-2 text-center  text-xs text-slate-600">
                {formatDate(
                  getField(
                    doc,
                    ["updated_at", "tgl_update"],
                    "-"
                  )
                )}
              </td>
            </>
          ) : (
            <>
              {/* REVISI */}

              <td className="px-3 py-2 text-center text-xs font-semibold text-slate-700">
                {getRevision(doc)}
              </td>

              {/* TANGGAL UPDATE */}

              <td className="whitespace-nowrap px-3 py-2 text-center text-xs text-slate-600">
                {formatDate(
                  getField(
                    doc,
                    ["updated_at", "tgl_update"],
                    "-"
                  )
                )}
              </td>

              {/* DIPERBAIKI OLEH */}

              {/* <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                {getUpdaterLabel(doc)}
              </td> */}
            </>
          )}
        </tr>
      );
    });

  if (!open) return null;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={800}
      actions={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
        >
          Tutup
        </button>
      }
    >
      <div className="flex w-full flex-col gap-3">
        {/* INFORMASI */}

        <div
          className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
            isPic
              ? "border-blue-200 bg-blue-50"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          {isPic ? (
            <Info
              size={24}
              className="mt-0.5 shrink-0 text-blue-600"
            />
          ) : (
            <AlertCircle
              size={24}
              className="mt-0.5 shrink-0 text-orange-500"
            />
          )}

          <div className="flex flex-col gap-0.5">
            <span
              className={`text-xs font-bold ${
                isPic
                  ? "text-blue-700"
                  : "text-orange-700"
              }`}
            >
              {isPic
                ? "TUGAS PEMERIKSAAN ULANG"
                : "PERHATIAN"}
            </span>

            <span
              className={`text-xs leading-relaxed ${
                isPic
                  ? "text-blue-900"
                  : "text-orange-900"
              }`}
            >
              {isPic
                ? "Periksa SPP yang diproses Lengkap dan SPP yang telah diperbaiki."
                : "Perbaiki SPP yang butuh perbaikan, sebelum membuat pengajuan baru."}
            </span>
          </div>
        </div>

        {/* TAB PIC */}

        {isPic && (
          <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => changeTab("diproses")}
            className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-bold transition-colors ${
              activeTab === "diproses"
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            SPP Diproses (Lengkap)

            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] text-white">
              {totalDiprosesPIC}
            </span>
          </button>

          <button
            type="button"
            onClick={() => changeTab("perbaikan")}
            className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-bold transition-colors ${
              activeTab === "perbaikan"
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            SPP Telah Diperbaiki

            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white">
              {totalDiperbaikiPIC}
            </span>
          </button>
          </div>
        )}

        {/* JUDUL DAN TOTAL */}

        <div className="flex items-center justify-between gap-2 rounded-lg bg-sky-50 px-3 py-2">
          <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
          {isPic
            ? activeTab === "diproses"
              ? "Daftar SPP Berstatus Diproses (Lengkap)"
              : "Daftar SPP Telah Diperbaiki"
            : "Daftar SPP Perlu Diperbaiki"}
          </h3>

          <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            {isPic
              ? activeTab === "diproses"
                ? totalDiprosesPIC
                : totalDiperbaikiPIC
              : totalDiperbaikiUser}{" "}
            SPP
          </span>
        </div>

        {/* CATATAN PIC */}

        {isPic && (
          <div
            className={`rounded-md border px-3 py-2 ${
              activeTab === "diproses"
                ? "border-blue-100 bg-blue-50/70"
                : totalDiperbaikiPIC > MAX_PENDING
                  ? "border-rose-200 bg-rose-50"
                  : "border-blue-100 bg-blue-50/70"
            }`}
          >
            <p
              className={`text-xs leading-relaxed ${
                activeTab === "diproses"
                  ? "text-blue-800"
                  : totalDiprosesPIC > MAX_PENDING
                    ? "text-rose-700"
                    : "text-blue-800"
              }`}
            >
                {activeTab === "diproses"
                  ? `Terdapat ${totalDiprosesPIC} SPP Berstatus Diproses (Lengkap), Mohon cocokan dengan Data SP2D MyIntrest/SAKTI dan Ubah status SPP menjadi SP2D`
                : totalDiprosesPIC > MAX_PENDING
                 ? `Terdapat ${totalDiperbaikiPIC} SPP Berstatus Telah Diperbaiki, Mohon periksa kembali SPP hasil Revisi`
                  : `Terdapat ${totalDiperbaikiPIC} SPP Telah Perbaikan, Lakukan verifikasi ulang`}
            </p>
          </div>
        )}

        {/* CATATAN USER */}

        {!isPic && (
          <div
            className={`rounded-md border px-3 py-2 ${
              tambahPengajuanDisabled
                ? "border-orange-200 bg-orange-50"
                : "border-blue-100 bg-blue-50/70"
            }`}
          >
            <p
              className={`text-xs leading-relaxed ${
                tambahPengajuanDisabled
                  ? "text-orange-800"
                  : "text-blue-800"
              }`}
            >
              {tambahPengajuanDisabled
                ? `Terdapat ${totalDiperbaikiUser} SPP Berstatus Diproses (Perlu Perbaikan), Mohon diperbaiki terlebih dahulu agar dapat membuat pengajuan baru.`
                : `Terdapat ${totalDiperbaikiUser} SPP Berstatus Diproses (Perlu Perbaikan), Mohon diperbaiki terlebih dahulu sebelum pengajuan baru.`}
            </p>
          </div>
        )}

        {/* ERROR */}

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-rose-600"
            />

            <div className="flex-1 text-xs leading-relaxed text-rose-700">
              {errorMessage}
            </div>

            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            >
              <RefreshCw size={13} />
              Coba lagi
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-400">
            <Loader2
              size={30}
              className="animate-spin text-blue-500"
            />

            <span className="text-xs font-medium">
              Memuat summary dokumen...
            </span>
          </div>
        ) : dataAktif.length > 0 ? (
          <>
            {/* TABLE */}

            <div className="w-full overflow-hidden rounded-lg border border-slate-200">
              <div className="max-h-[50vh] overflow-auto">
                <table className="w-full min-w-max border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr>
                      {headers.map((header) => (
                        <th
                          key={header}
                          className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center text-[10px] font-bold text-slate-600 sm:text-[11px]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {renderRows()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-600">
                Menampilkan {startData}–{endData} dari{" "}
                {dataAktif.length} baris
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold ${
                      currentPage === pageNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* EMPTY STATE */

          <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-100 bg-slate-50 py-8">
            <FileWarning
              size={42}
              className="text-slate-400"
            />

            <span className="text-sm font-medium text-slate-700">
              {errorMessage
                ? "Data belum dapat ditampilkan."
                : "Belum ada data SPP yang dapat ditampilkan."}
            </span>

            <span className="max-w-md px-4 text-center text-xs leading-relaxed text-slate-500">
              {isPic
                ? "Belum terdapat data SPP yang sesuai untuk ditampilkan. Silakan periksa kembali daftar pengajuan."
                : "Belum terdapat data SPP yang perlu diperbaiki. Silakan periksa kembali daftar pengajuan."}
            </span>

            {!errorMessage && (
              <button
                type="button"
                onClick={() => fetchData(true)}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Muat ulang
              </button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}