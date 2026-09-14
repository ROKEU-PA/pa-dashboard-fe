export const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const getYears = (range = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range }, (_, i) => currentYear - i);
};

export const timCodes = {
  "Tata Usaha": 21580002,
  "PTUK": 21580003,
  "Pelaksanaan Anggaran": 21580004,
  "Akuntansi & Pelaporan": 21580005,
  "Barang Milik Negara": 21580006,
};

export const palette = [
  "#2f89ff",
  "#4ec982",
  "#8b63ff",
  "#f5a53a",
  "#ff5b5b",
  "#20a25d",
  "#1d73ed",
];
