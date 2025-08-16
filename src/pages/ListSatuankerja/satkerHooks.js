export const columns = [
  { key: "spp_number", label: "No. SPP" },
  { key: "created_at", label: "Tanggal Pengiriman", sortable: true },
  { key: "jenis_spp", label: "Jenis SPP", sortable: true },
  { key: "tahun", label: "Tahun", sortable: true },
  { key: "document", label: "Dokumen" },
  { key: "revisi", label: "Revisi"},
  { key: "status", label: "Status", hiddenInArsip: true },
  { key: "kelengkapan", label: "Kelengkapan", hiddenInArsip: true },
  { key: "catatan", label: "Catatan"},
  { key: "action", label: "Action" },
];

export function getCurrentSatuanKerja(menuList, pathname) {
  const cleanPath = pathname.replace('/pengajuan', '');
  const allowedPaths = menuList.map((item) => item.path);
  if (!allowedPaths.includes(cleanPath)) {
    return null;
  }
  return menuList.find((item) => item.path === cleanPath) || null;
}

export function isPengajuanPath(pathname) {
  return pathname.includes('/pengajuan');
}
