export const columns = [
  { key: "spp_number", label: "No. SPP" },
  { key: "created_at", label: "Tanggal Pengiriman", sortable: true },
  { key: "jenis_spp", label: "Jenis SPP", sortable: true },
  { key: "tahun", label: "Tahun", sortable: true },
  { key: "document", label: "Dokumen SPP & Pendukung" },
  { key: "revisi", label: "Revisi", hiddenInArsip: true},
  { key: "status", label: "Status", hiddenInArsip: true },
  { key: "kelengkapan", label: "Kelengkapan", hiddenInArsip: true },
  { key: "catatan", label: "Catatan"},
  { key: "action", label: "Action" },
];

export function getCurrentSatuanKerja(menuList, pathname) {
  if (!menuList || !pathname) return null;

  const pathParts = pathname
    .split("/")
    .filter(Boolean);
  const currentSatker = pathParts[pathParts.length - 1];
  return (
    menuList.find((item) => {
      if (!item.path) return false;

      const menuParts = item.path
        .split("/")
        .filter(Boolean);

      const menuSatker =
        menuParts[menuParts.length - 1];

      return menuSatker === currentSatker;
    }) || null
  );
}

export function isPengajuanPath(pathname) {
  return pathname.includes('/pengajuan');
}
