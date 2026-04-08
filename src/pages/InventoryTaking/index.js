import React, { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";

const databaseBarang = [
  { id: "ATK-001", nama: "Toner HP 83A", satuan: "Buah", stok: 10, img: "/TonerHP83A.png" },
  { id: "ATK-002", nama: "Toner HP 107A", satuan: "Buah", stok: 12, img: "/TonerHP107A.png" },
  { id: "ATK-003", nama: "Toner Fuji Xerox Biru", satuan: "Buah", stok: 5, img: "/TonerFujiXeroxBiru.png" },
  { id: "ATK-004", nama: "Toner Fuji Xerox Merah", satuan: "Buah", stok: 5, img: "/TonerFujiXeroxMerah.png" },
  { id: "ATK-005", nama: "Tooner Fuji Xerox Kuning", satuan: "Buah", stok: 5, img: "/TonerFujiXeroxKuning.png" },
  { id: "ATK-006", nama: "Flashdisk 16Gb - Sandisk", satuan: "Buah", stok: 15, img: "/Flashdisk16GbSandisk.png" },
  { id: "ATK-007", nama: "Amplop Putih no.90", satuan: "Box", stok: 20, img: "/AmplopPutihno90.png" },
  { id: "ATK-008", nama: "Kertas A4 80Gram - Bola Dunia", satuan: "Rim", stok: 50, img: "/KertasA480GramBola Dunia.png" },
  { id: "ATK-009", nama: "Post IT Sign Here (Pronto)", satuan: "Pack", stok: 30, img: "/PostITSignHerePronto.png" },
  { id: "ATK-010", nama: "Post IT Memo Kuning 654 3M", satuan: "Pack", stok: 25, img: "/PostITMemoKuning654_3M.png" },
  { id: "ATK-011", nama: "Post IT Memo Kuning 656 3M", satuan: "Pack", stok: 25, img: "/PostITMemoKuning656_3M.png" },
  { id: "ATK-012", nama: "Bindex Pocket (Box File) - Hitam", satuan: "Buah", stok: 18, img: "/BindexPocketBox FileHitam.png" },
  { id: "ATK-013", nama: "Bantex File (Odner Hitam)", satuan: "Buah", stok: 15, img: "/Bantex FileOdnerHitam.png" },
  { id: "ATK-014", nama: "Pulpen Joyko Qgel GP-265", satuan: "Lusin", stok: 40, img: "/PulpenJoykoQgelGP-265.png" },
  { id: "ATK-015", nama: "Baterai Alkaline AA", satuan: "Set", stok: 35, img: "/BateraiAlkalineAA.png" },
  { id: "ATK-016", nama: "Lakban Putih Bening 2Inch", satuan: "Roll", stok: 20, img: "/LakbanPutihBening2Inch.png" },
];

export default function InventoryTaking() {
  const [keranjang, setKeranjang] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [listKonfirmasi, setListKonfirmasi] = useState([]);
  const [teksWA, setTeksWA] = useState("");

  const ubahJumlah = (id, perubahan, stok) => {
    setKeranjang((prev) => {
      let jumlah = (prev[id] || 0) + perubahan;

      if (jumlah < 0) jumlah = 0;
      if (jumlah > stok) {
        alert("Melebihi stok!");
        jumlah = stok;
      }

      return { ...prev, [id]: jumlah };
    });
  };

  const checkoutWA = () => {
    let list = [];
    let teks = `Halo Admin, berikut permintaan saya:\n\n`;

    databaseBarang.forEach((b) => {
      const jumlah = keranjang[b.id] || 0;
      if (jumlah > 0) {
        list.push(`${b.nama} (${jumlah} ${b.satuan})`);
        teks += `- ${b.nama} (${jumlah} ${b.satuan})\n`;
      }
    });

    if (list.length === 0) {
      alert("Belum pilih barang!");
      return;
    }

    teks += "Mohon untuk diproses,\nTerima kasih.";

    setListKonfirmasi(list);
    setTeksWA(teks);
    setShowModal(true);
  };

  const sendToWA = () => {
    const nomor = "085122777026"; 
    window.location.href = `https://wa.me/${nomor}?text=${encodeURIComponent(teksWA)}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto p-4">

        <div className="bg-white rounded-xl shadow p-4 text-center mb-4">
          <h1 className="text-lg font-bold">Pengambilan Persediaan</h1>
          <p className="text-sm text-gray-500">Biro Keuangan dan BMN</p>
        </div>

        {databaseBarang.map((barang) => (
          <div key={barang.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow mb-2">
            <img src={barang.img} alt="" className="w-12 h-12 object-contain" />

            <div className="flex-1 ml-3">
              <h2 className="font-semibold text-sm">{barang.nama}</h2>
              <p className="text-xs text-gray-500">
                {barang.satuan} | Stok: {barang.stok}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => ubahJumlah(barang.id, -1, barang.stok)}
                className="text-red-500 text-xl"
              >
                -
              </button>

              <span className="w-6 text-center">
                {keranjang[barang.id] || 0}
              </span>

              <button
                onClick={() => ubahJumlah(barang.id, 1, barang.stok)}
                className="text-green-500 text-xl"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0  md:relative flex justify-center w-full">
        <div className="w-full  bg-white/80 backdrop-blur-md p-4 md:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
            onClick={checkoutWA}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h2 className="font-bold mb-2">Konfirmasi</h2>

            <ul className="text-sm mb-3">
              {listKonfirmasi.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Kembali
              </button>

              <button
                onClick={sendToWA}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
               Ya, Kirim Sekarang <SendHorizontal className=" w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}