export const requiredValidator =
  (fieldName = "Field ini") =>
  (val) =>
    !val ? `${fieldName} wajib diisi` : "";

export const validationSchema = {
  name: (val) => {
    if (!val) return "Wajib diisi";
    if (val.length > 15) return "Maksimal 15 huruf";
    if (!/^[a-zA-Z\s]+$/.test(val)) return "Hanya boleh huruf";
    return "";
  },

  numberspp: (val) => {
    if (!val) return "Wajib diisi";
    if (val.length > 5) return "Maksimal 5 angka";
    if (!/^\d+$/.test(val)) return "Hanya boleh angka";
    return "";
  },

  onlyNumber: (val) => {
    if (!val) return "Wajib diisi";
    return /^\d+$/.test(val) ? "" : "Hanya boleh angka";
  },

  tahun: (val) => {
    if (!val) return "Wajib diisi";
    if (!/^\d{4}$/.test(val)) return "Format tahun harus 4 digit angka";
    
    const year = parseInt(val, 10);
    const currentYear = new Date().getFullYear();
    
    if (year > currentYear) return `Tahun maksimal ${currentYear}`;
    return "";
  },

  password: (val) => {
    if (!val) return "Wajib diisi";
    if (val.length < 8) return "Minimal 8 karakter";
    if (!/[A-Z]/.test(val)) return "Harus mengandung huruf besar";
    if (!/\d/.test(val)) return "Harus mengandung angka";
    return "";
  },

  filePdf: (file) => {
    if (!file) return "File wajib diunggah";
    const allowed = ["pdf"];
    const ext = file.name.split(".").pop().toLowerCase();
    return allowed.includes(ext) ? "" : "File harus format PDF";
  },

  fileExcel: (file) => {
    if (!file) return "File wajib diunggah";
    const allowed = ["xls", "xlsx"];
    const ext = file.name.split(".").pop().toLowerCase();
    return allowed.includes(ext) ? "" : "File harus format Excel (xls/xlsx)";
  },

  fileWord: (file) => {
    if (!file) return "File wajib diunggah";
    const allowed = ["doc", "docx"];
    const ext = file.name.split(".").pop().toLowerCase();
    return allowed.includes(ext) ? "" : "File harus format Word (doc/docx)";
  },

  link: (val) => {
    if (!val) return "Link tidak boleh kosong";
    const pattern = /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+.*$/i;
    if (!pattern.test(val)) {
      return "Format link tidak valid, harus diawali https://";
    }
    return "";
  },
};

export function formatUrlPathToTitle(url) {
  if (!url) return "";

  const segments = url.split("/");
  const lastSegment = segments[segments.length - 1];

  const abbreviationMap = {
    spp: "SPP",
  };

  const formatted = lastSegment
    .split("-")
    .map((word) => {
      if (abbreviationMap[word.toLowerCase()]) {
        return abbreviationMap[word.toLowerCase()];
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return formatted;
}

export const combineValidators =
  (...fns) =>
  (val) => {
    for (const fn of fns) {
      const result = fn(val);
      if (result) return result;
    }
    return "";
  };

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  return query.toString(); // returns a=b&c=d
};

export function filterDataByCode(dataArray, targetCode) {
  // Validate that dataArray is actually an array
  if (!Array.isArray(dataArray)) {
    throw new Error("First argument must be an array.");
  }

  // Validate that targetCode is a number
  if (typeof targetCode !== "number") {
    throw new Error("Target code must be a number.");
  }

  // Filter and return items where item's code exactly equals the targetCode
  return dataArray.filter((item) => item.code === targetCode);
}

export const isAuthorizedRoute = (pathname, userData, menus = []) => {
  // console.log("user", userData);
  const isSuperAdmin = userData?.role === "super_admin";
  const isAdmin = userData?.role === "admin";
  const isUser = userData?.role === "user";
  const isPIC = userData?.role === "pic";
  const isGuest = userData?.role === "guest";

  // 1. Super Admin bisa akses semua
  if (isSuperAdmin) return true;
  if (isAdmin) return true;

  // 2. User bisa akses Pelaksanaan Anggaran (aktualisasi)
  if (isUser || isPIC) {
    if (pathname === "/dashboard/pelaksanaan-anggaran") return true;
    if (pathname.startsWith("monitoring")) return true;
    if (pathname === "/pelaksanaan-anggaran") return true;
    if (pathname === "/satuan-kerja") return true;
    if (pathname === "/kalender") return true;

    const matched = menus.find((menu) => menu.path === pathname);
    if (!matched) return false;

    return userData?.access_code?.includes(Number(matched.code));
  }

  // 3. Guest tidak bisa akses /satuan-kerja
  if (isGuest) {
    if (pathname.startsWith("/dashboard")) return true;
    if (pathname.startsWith("/ptuk")) return true;
    if (pathname.startsWith("/pelaksanaan-anggaran")) return true;
    if (pathname === "/ikpa") return true;
    if (pathname === "/realisasi") return true;
    if (pathname.startsWith("/tata-usaha")) return true;
    if (pathname.startsWith("/barang-milik-negara")) return true;
    if (pathname === "/kalender") return true;
  }

  if (pathname === "/") return true;

  // 4. Hanya admin yang bisa akses /compilation dan /user-management
  if (pathname === "/compilation" || pathname === "/user-management")
    return false;
};

export const cryptoEncrypter = (string) => {
  if (!string || string === "" || string === undefined) return null;
  let CryptoJS = require("crypto-js");
  let encryptedString = CryptoJS.AES.encrypt(
    string,
    "YzDWFXF8LmfUMdOn0RtZ0rYC90zF5wpoz87oCk"
  ).toString();
  return encryptedString;
};

export function formatCurrency(amount) {
  return (
    "Rp. " +
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  );
}

export function formatNumber(amount) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
