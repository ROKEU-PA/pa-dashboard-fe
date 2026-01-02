export const AssetConditions = [
  {
    title: "Total Aset",
    value: 530130,
    containerStyle:
      "bg-blue-400 rounded px-2 w-[60%] text-white text-center items-center",
  },
  { title: "Kondisi Baik", value: 480692 },
  { title: "Rusak Ringan", value: 1295 },
  { title: "Rusak Berat", value: 48143 },
  { title: "Nilai Aset", value: 16184055648805, style: "col-span-2" },
];

export const dataTable = {
  columns: [
    { label: "Eselon 1", style: "bg-[#2E70FD] rounded p-2 text-white" },
    {
      label: "Baik",
    },
    {
      label: "Rusak Ringan",
    },
    {
      label: "Rusak Berat",
    },
    {
      label: "Total",
      style: "bg-[#FF0000] rounded p-2 text-white",
    },
  ],
  data: [
    {
      name: "Sekretariat Jenderal",
      baik: 23378,
      rusakRingan: 9,
      rusakBerat: 4941,
      total: 28329,
    },
    {
      name: "Inspektorat Jenderal",
      baik: 1257,
      rusakRingan: 32,
      rusakBerat: 0,
      total: 1289,
    },
    {
      name: "Ditjen Binapenta",
      baik: 35171,
      rusakRingan: 16,
      rusakBerat: 5011,
      total: 40198,
    },
    {
      name: "PHI dan Jamsostek",
      baik: 3039,
      rusakRingan: 0,
      rusakBerat: 7399,
      total: 10438,
    },
    {
      name: "Binwasnaker dan K3",
      baik: 20986,
      rusakRingan: 46,
      rusakBerat: 6040,
      total: 27072,
    },
    {
      name: "Barenbang",
      baik: 2725,
      rusakRingan: 0,
      rusakBerat: 41,
      total: 2766,
    },
    {
      name: "Binalavotas",
      baik: 394135,
      rusakRingan: 1192,
      rusakBerat: 24711,
      total: 420038,
    },
  ],
};
