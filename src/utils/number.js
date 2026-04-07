export function formatNumberID(num) {
  if (num == null || isNaN(num)) return "-";

  const abs = Math.abs(num);

  const truncate = (value) => {
    const truncated = Math.floor(value * 100) / 100; // 🔥 no rounding
    return truncated % 1 === 0 ? truncated.toString() : truncated.toString();
  };

  const format = (value, unit) => {
    return `${truncate(value)} ${unit}`;
  };

  if (abs >= 1_000_000_000_000) {
    return format(num / 1_000_000_000_000, "Triliun");
  }

  if (abs >= 1_000_000_000) {
    return format(num / 1_000_000_000, "Miliar");
  }

  if (abs >= 1_000_000) {
    return format(num / 1_000_000, "Juta");
  }

  if (abs >= 1_000) {
    return format(num / 1_000, "Ribu");
  }

  return num.toString();
}
