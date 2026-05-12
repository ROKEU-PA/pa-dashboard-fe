import React, { useEffect, useState, useCallback } from "react";
import { SendHorizontal, Loader2, PackageOpen, Plus, Minus, Info } from "lucide-react";
import { apiTU } from "@/services/ApiTU";

export default function InventoryTaking() {
  const [databaseBarang, setDatabaseBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Struktur keranjang: { [id]: { qty: 0, satuan: "Pcs" } }
  const [keranjang, setKeranjang] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchBarang = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiTU({ url: "api/barang" });
      setDatabaseBarang(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarang();
  }, [fetchBarang]);

  const ubahJumlah = (id, perubahan, stok, satuanDefault) => {
    setKeranjang((prev) => {
      const itemLama = prev[id] || { qty: 0, satuan: satuanDefault };
      const jumlahBaru = itemLama.qty + perubahan;

      if (jumlahBaru < 0) return { ...prev, [id]: { ...itemLama, qty: 0 } };
      if (jumlahBaru > stok) {
        alert("Stok tidak mencukupi!");
        return { ...prev, [id]: { ...itemLama, qty: stok } };
      }
      return { ...prev, [id]: { ...itemLama, qty: jumlahBaru } };
    });
  };

  const ubahSatuan = (id, satuanBaru) => {
    setKeranjang((prev) => ({
      ...prev,
      [id]: { ...prev[id], satuan: satuanBaru },
    }));
  };

  const handleCheckout = () => {
    const adaBarang = Object.values(keranjang).some((item) => item.qty > 0);
    if (!adaBarang) {
      alert("Silahkan pilih barang terlebih dahulu!");
      return;
    }
    setShowModal(true);
  };

  const sendToWA = () => {
    const nomor = "6285122777026";
    let teks = "!ORDER_BARANG\n\n";

    databaseBarang.forEach((b) => {
      const item = keranjang[b.id];
      if (item && item.qty > 0) {
        teks += `- [${b.id}] ${b.nama} (${item.qty} ${item.satuan})\n`;
      }
    });

    window.location.href = `https://wa.me/${nomor}?text=${encodeURIComponent(teks)}`;
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Menghubungkan ke Gudang...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-sm">
          <PackageOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-red-600 font-bold text-lg">Gagal Mengambil Data</h2>
          <button onClick={fetchBarang} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold mt-4">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 w-full mb-24">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center mb-6 border-b-4 border-blue-500">
          <h1 className="text-xl font-extrabold text-gray-800">Katalog Persediaan</h1>
          <p className="text-sm text-gray-500 mt-1">Biro Keuangan dan BMN - SisKA</p>
        </div>

        <div className="grid gap-3">
          {databaseBarang.map((barang) => (
            <div key={barang.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                <img 
                  src={barang.img} 
                  alt={barang.nama} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img"; }}
                />
              </div>

              <div className="flex-1 ml-4">
                <h2 className="font-bold text-gray-800 text-sm leading-tight">{barang.nama}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Stok: <span className="font-bold text-blue-600">{barang.stok}</span> {barang.satuan}
                </p>
              </div>

              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => ubahJumlah(barang.id, -1, barang.stok, barang.satuan)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-red-500 shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-700">
                  {keranjang[barang.id]?.qty || 0}
                </span>
                <button
                  onClick={() => ubahJumlah(barang.id, 1, barang.stok, barang.satuan)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-green-600 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Item</p>
            <p className="text-lg font-black text-blue-600">
              {Object.values(keranjang).reduce((a, b) => a + b.qty, 0)} <span className="text-sm font-normal text-gray-400">Barang</span>
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <SendHorizontal className="w-4 h-4" />
            Checkout
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Info className="w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">Review Pesanan</h2>
            </div>

            <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {databaseBarang.filter(b => keranjang[b.id]?.qty > 0).map((b) => (
                <div key={b.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-2">{b.nama}</p>
                  <div className="flex items-center justify-between gap-4">
                    <select
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={keranjang[b.id].satuan}
                      onChange={(e) => ubahSatuan(b.id, e.target.value)}
                    >
                      {["Pcs", "Pack", "Box", "Rim", "Buku", "Roll"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200">
                      <button onClick={() => ubahJumlah(b.id, -1, b.stok, b.satuan)} className="px-2 text-red-500"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center text-sm font-bold">{keranjang[b.id].qty}</span>
                      <button onClick={() => ubahJumlah(b.id, 1, b.stok, b.satuan)} className="px-2 text-green-600"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={sendToWA} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100">
                Kirim ke WhatsApp
              </button>
              <button onClick={() => setShowModal(false)} className="w-full py-3 text-gray-500 font-semibold">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}