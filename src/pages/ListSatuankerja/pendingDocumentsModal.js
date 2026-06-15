import { useContext, useEffect, useState } from "react";
import { apiRequest } from "@/services/APIHelper";
import Dialog from "@/components/Dialog";
import { AppContext } from "@/contexts/AppContext";
import { AlertCircle, FileWarning, Loader2, Info } from "lucide-react";

export default function PendingDocumentsModal({ open, onClose, code }) {
  const { userData } = useContext(AppContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest({
        url: `/archive/summary/lack?biro_code=${code}`,
      });
      if (res.success) setDocs(res.data);
    } catch (e) {
      console.error("Gagal load:", e);
    } finally {
      setLoading(false);
    }
  };

  // Tetap dipertahankan: Kalau loading selesai dan data kosong, modal gak usah nongol
  if (!loading && docs.length === 0) return null;

  const isPic = userData?.role === "pic";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Daftar Dokumen Belum Lengkap"
      maxWidth={900}
      actions={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors border border-slate-200 shadow-sm"
        >
          Tutup
        </button>
      }
    >
      <div className="flex flex-col gap-4 w-full">
        {/* BANNER ALERT BERDASARKAN ROLE */}
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm ${
            isPic
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          {isPic ? (
            <Info size={24} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={24} className="mt-0.5 shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">
              {isPic ? "TUGAS PEMERIKSAAN" : "PERHATIAN"}
            </span>
            <span className="text-sm mt-0.5 opacity-90">
              {isPic
                ? "Tolong periksa ulang SPP yang ada di list berikut jika sudah diperbaiki oleh user!"
                : "Tolong segera lengkapi dokumen pendukung di bawah ini sebelum mengajukan SPP!"}
            </span>
          </div>
        </div>

        {/* AREA KONTEN (LOADING / TABLE) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <span className="text-sm font-medium">Memuat data dokumen...</span>
          </div>
        ) : docs.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    {[
                      "No",
                      "No SPP",
                      "Tipe",
                      "Tahun",
                      "Tanggal SPP",
                      "Tgl Update Terakhir",
                    ].map((header, idx) => (
                      <th
                        key={header}
                        className={`px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider ${
                          idx === 0 ? "text-center w-12" : ""
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {docs.map((d, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/50 transition-colors duration-200 group"
                    >
                      <td className="px-4 py-3 text-sm text-slate-500 text-center font-medium">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-700">
                        {d.no_spp}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                          {d.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {d.tahun}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {d.tgl_spp || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {d.tgl_update || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
            <FileWarning size={32} className="text-slate-300" />
            <span className="text-sm font-medium">
              Tidak ada dokumen yang belum lengkap.
            </span>
          </div>
        )}
      </div>
    </Dialog>
  );
}