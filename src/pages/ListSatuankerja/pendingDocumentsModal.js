import { useContext, useEffect, useState } from "react";
import { apiRequest } from "@/services/APIHelper";
import Dialog from "@/components/Dialog";
import { AppContext } from "@/contexts/AppContext";

export default function PendingDocumentsModal({ open, onClose, code }) {
  const { userData } = useContext(AppContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const fetchData = async () => {
    try {
      const res = await apiRequest({
        url: `/api/archive/summary/lack?biro_code=${code}`,
      });
      if (res.success) setDocs(res.data);
    } catch (e) {
      console.error("Gagal load:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && docs.length === 0) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Daftar Dokumen Pendukung SPP Belum Lengkap"
      maxWidth={900}
      actions={
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Tutup
        </button>
      }
    >
      {userData?.role === "pic" ? (
        <p style={{ marginBottom: "0.5rem" }}>
          Tolong periksa ulang SPP yang ada di list, jika sudah diperbaiki!
        </p>
      ) : (
        <p style={{ marginBottom: "0.5rem" }}>
          Tolong segera lengkapi, sebelum mengajukan SPP!
        </p>
      )}
      {loading ? (
        <p style={{ textAlign: "center", padding: "1rem" }}>Memuat data...</p>
      ) : docs.length > 0 ? (
        <div
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: 6,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{ backgroundColor: "#f9fafb", position: "sticky", top: 0 }}
            >
              <tr>
                {[
                  "No",
                  "No SPP",
                  "Tipe",
                  "Tahun",
                  "Tanggal SPP",
                  "Tanggal Update",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f8f9fa",
                  }}
                >
                  <td style={cell}>{i + 1}</td>
                  <td style={cell}>{d.no_spp}</td>
                  <td style={cell}>{d.type}</td>
                  <td style={cell}>{d.tahun}</td>
                  <td style={cell}>{d.tgl_spp}</td>
                  <td style={cell}>{d.tgl_update}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>
          Tidak ada dokumen belum lengkap.
        </p>
      )}
    </Dialog>
  );
}

const cell = {
  padding: "8px",
  borderBottom: "1px solid #eee",
  fontSize: "0.9rem",
};
