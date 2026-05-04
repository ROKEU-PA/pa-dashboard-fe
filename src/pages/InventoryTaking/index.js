import React, { useEffect, useState, useCallback } from "react";
import { SendHorizontal, Loader2, PackageOpen, Plus, Minus, Info } from "lucide-react";
import { apiTU } from "@/services/ApiTU"; 

export default function InventoryTaking() {
  const [databaseBarang, setDatabaseBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [keranjang, setKeranjang] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [listKonfirmasi, setListKonfirmasi] = useState([]);

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

  const ubahJumlah = (id, perubahan, stok) => {
    setKeranjang((prev) => {
      const jumlahSekarang = (prev[id] || 0) + perubahan;
      if (jumlahSekarang < 0) return { ...prev, [id]: 0 };
      if (jumlahSekarang > stok) {
        alert("Stok tidak mencukupi!");
        return { ...prev, [id]: stok };
      }
      return { ...prev, [id]: jumlahSekarang };
    });
  };

  const handleCheckout = () => {
    const list = [];
    let adaBarang = false;

    databaseBarang.forEach(b => {
      const qty = keranjang[b.id] || 0;
      if (qty > 0) {
        // Untuk tampilan di modal
        list.push(`${b.nama} (${qty} ${b.satuan})`);
        adaBarang = true;
      }
    });

    if (!adaBarang) {
      alert("Silahkan pilih barang terlebih dahulu!");
      return;
    }

    setListKonfirmasi(list);
    setShowModal(true);
  };

  const sendToWA = () => {
    const nomor = "6285122777026";
    let teks = "!ORDER_BARANG\n\n";
    
    databaseBarang.forEach((b) => {
      const qty = keranjang[b.id] || 0;
      if (qty > 0) {
        teks += `- [${b.id}] ${b.nama} (${qty} ${b.satuan})\n`;
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
          <h2 className="text-red-600 font-bold text-lg">Gagal Mengambil Data Barang</h2>
          <p className="text-slate-500 text-sm mb-6 mt-2">{error}</p>
          <button 
            onClick={fetchBarang} 
            className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col">
      <div className="min-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center mb-6 border-b-4 border-blue-500">
          <h1 className="text-xl font-extrabold text-gray-800">Katalog Persediaan</h1>
          <p className="text-sm text-gray-500 mt-1">Biro Keuangan dan BMN - SisKA</p>
        </div>
        <div className="grid gap-3">
          {databaseBarang.map((barang) => (
            <div key={barang.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                <img 
                  src={barang.img} 
                  alt={barang.nama} 
                  className="w-12 h-12 object-contain"
                  onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img"; }} 
                />
              </div>

              <div className="flex-1 ml-4">
                <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{barang.nama}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {barang.satuan} <span className="mx-1">|</span> Stok: <span className="font-bold text-blue-600">{barang.stok}</span>
                </p>
              </div>

              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 border border-gray-200">
                <button
                  onClick={() => ubahJumlah(barang.id, -1, barang.stok)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-red-500 shadow-sm active:scale-90 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-bold text-gray-700">
                  {keranjang[barang.id] || 0}
                </span>

                <button
                  onClick={() => ubahJumlah(barang.id, 1, barang.stok)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-green-600 shadow-sm active:scale-90 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
       </div>

       <div className="sticky bottom-0 rounded-2xl w-full bg-white backdrop-blur-lg border-t border-gray-100">
            <div className="max-w-5xl mx-auto p-4">
              <div className="flex items-center justify-between gap-4">
                
                <div className="flex-1">
                  <p className="text-[13px] md:text-[15px] text-gray-500">Ringkasan:</p>
                  <p className="font-bold text-gray-900 text-[13px] md:text-[20px]">
                    {Object.values(keranjang).reduce((a, b) => a + b, 0)} Barang Terpilih
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className=" bg-blue-600 text-[11] md:text-[11] hover:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <p className="text-[11] p-1">Kirim ke WhatsApp</p>
                </button>

              </div>
            </div>
          </div>
       
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-in-center transition-all border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Info className="w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">Konfirmasi Pesanan</h2>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 max-h-60 overflow-y-auto border border-gray-100">
              <ul className="space-y-2">
                {listKonfirmasi.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-400 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={sendToWA}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-colors"
              >
                Ya, Kirim Sekarang
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-500 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}