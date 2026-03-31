export const statusColorClass = (statusValue) => {
  switch (statusValue) {
    case "approved":
      return "border border-green-500 bg-green-100";
    case "reject":
      return "border border-red-500 bg-red-100";
    case "sp2d":
      return "border border-yellow-500 bg-yellow-100";
    default:
      return "border border-blue-500 bg-blue-100";
  }
};

export const statusColorText = (statusValue) => {
  switch (statusValue) {
    case "approved":
      return "font-semibold text-green-500";
    case "reject":
      return "font-semibold text-red-500";
    case "sp2d":
      return "font-semibold text-yellow-500";
    default:
      return "font-semibold text-blue-500";
  }
};

export const statusLabel = (statusValue) => {
  switch (statusValue) {
    case "approved":
      return "Telah Diuji";
    case "reject":
      return "Ditolak";
    case "sp2d":
      return "SP2D";
    default:
      return "Baru ditambahkan";
  }
};
