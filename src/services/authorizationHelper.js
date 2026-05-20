const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
  PIC: "pic",
  GUEST: "guest",
};

const PUBLIC_ROUTES = ["/"];

const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: "*",
  [ROLES.ADMIN]: "*",
  [ROLES.GUEST]: "*",
  [ROLES.USER]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/e-arsip",                  // Mengizinkan masuk ke halaman pilih tahun
    "/arsip",                    // Mengizinkan rute dinamis arsip pertahun (/arsip/2018/biro-hukum)
    "/satuan-kerja/pengajuan",   // Menu grid utama pengajuan
    "/llat",                     // Modul pelaksanaan anggaran mandiri
  ],

  [ROLES.PIC]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/e-arsip",                  // Mengizinkan masuk ke halaman pilih tahun
    "/arsip",                    // Mengizinkan rute dinamis arsip pertahun (/arsip/2018/biro-hukum)
    "/satuan-kerja/pengajuan",   // Menu grid utama pengajuan
    "/llat",                     // Modul pelaksanaan anggaran mandiri
  ],
};

const ADMIN_ONLY_ROUTES = ["/compilation", "/user-management"];

const normalizePath = (pathname) => {
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
};

const matchesRoute = (pathname, route) => {
  const normalizedPath = normalizePath(pathname);
  const normalizedRoute = normalizePath(route);

  if (normalizedPath === normalizedRoute) return true;

  if (normalizedPath.startsWith(normalizedRoute + "/")) return true;

  return false;
};

// Fungsi pembersihan path agar cocok dengan path mentah database (Contoh database: /satuan-kerja/biro-hukum)
const getCleanedPathForMenuMatch = (pathname) => {
  // 1. Jika rute dinamis pengajuan satker: /satuan-kerja/pengajuan/biro-hukum -> /satuan-kerja/biro-hukum
  if (pathname.startsWith("/satuan-kerja/pengajuan")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 2) return pathname; 
    return `/satuan-kerja/${parts[parts.length - 1]}`;
  }

  // 2. Jika rute dinamis arsip pertahun: /arsip/2018/biro-hukum -> /satuan-kerja/biro-hukum
  if (pathname.startsWith("/arsip")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 3) {
      return `/satuan-kerja/${parts[2]}`; // Ambil nama satker pada elemen ke-3 URL
    }
  }

  return pathname;
};

const hasMenuAccess = (pathname, userData, menus) => {
  const cleanedPath = getCleanedPathForMenuMatch(pathname);
  const matchedMenu = menus.find((menu) => menu.path === cleanedPath);

  if (!matchedMenu) return false;

  if (!matchedMenu.code) return true;

  const userAccessCodes = userData?.access_code || [];
  return userAccessCodes.includes(Number(matchedMenu.code));
};

const hasRouteAccess = (pathname, allowedRoutes) => {
  if (!Array.isArray(allowedRoutes)) return false;

  return allowedRoutes.some((route) => matchesRoute(pathname, route));
};

export const isAuthorizedRoute = (pathname, userData, menus = []) => {
  if (!pathname || !userData) {
    console.warn("isAuthorizedRoute: Missing pathname or userData");
    return false;
  }

  const userRole = userData.role;
  const normalizedPath = normalizePath(pathname);

  console.log("Authorization check:", {
    pathname: normalizedPath,
    role: userRole,
    accessCodes: userData.access_code,
  });

  // 1. Jalur Publik
  if (PUBLIC_ROUTES.includes(normalizedPath)) {
    return true;
  }

  // 2. Akses Penuh Admin / Super Admin
  if (userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) {
    return true;
  }

  // 3. Aturan Khusus Halaman Manajemen Admin
  if (ADMIN_ONLY_ROUTES.some((route) => normalizedPath === route)) {
    return userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN;
  }

  // 4. Bypass Modul Tanda Terima
  if (normalizedPath.startsWith("/tanda-terima")) {
    return userRole === ROLES.USER || userRole === ROLES.PIC;
  }

  // 5. Filter Berdasarkan Role & Bypass Halaman Utama/Mandiri
  const allowedRoutes = ROLE_ROUTES[userRole];
  if (allowedRoutes === "*") return true;

  if (hasRouteAccess(normalizedPath, allowedRoutes)) {
    // KUNCI PERBAIKAN: Berikan izin langsung untuk halaman grid utama dan modul mandiri (LLAT)
    if (
      normalizedPath === "/satuan-kerja/pengajuan" || 
      normalizedPath.startsWith("/e-arsip") ||
      normalizedPath.startsWith("/llat") // Modul LLAT lolos murni tanpa harus masuk pengecekan kode satker backend
    ) {
      return true;
    }
  }

  // 6. Pengecekan Ketat untuk Detail Satker berdasarkan Access Code Database
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    return hasMenuAccess(normalizedPath, userData, menus);
  }

  console.warn("Access denied:", { pathname: normalizedPath, role: userRole });
  return false;
};

export const getDefaultRedirectPath = (userRole) => {
  switch (userRole) {
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN:
    case ROLES.GUEST:
      return "/dashboard-utama";
    case ROLES.USER:
    case ROLES.PIC:
      return "/satuan-kerja/pengajuan";
    default:
      return "/";
  }
};

export const getRedirectPathOnDenied = (pathname, userRole) => {
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    const parts = pathname.split("/").filter(Boolean);

    if (parts[0] === "satuan-kerja" && parts.length > 2) {
      return "/" + parts.slice(0, -1).join("/");
    }

    return "/satuan-kerja/pengajuan";
  }

  return getDefaultRedirectPath(userRole);
};