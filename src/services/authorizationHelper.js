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
  
  [ROLES.GUEST]: [
    "/dashboard-utama",
    "/pelaksanaan-anggaran",
    "/dashboard",
    "/ptuk",
    "/ikpa",
    "/realisasi",
    "/tata-usaha",
    "/barang-milik-negara",
    "/kalender",
    "/akuntansi-pelaporan"
  ],

  [ROLES.USER]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/satuan-kerja",
    "/pengajuan",
    "/e-arsip",                  
    "/arsip",                    
    "/kalender",
  ],

  [ROLES.PIC]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/satuan-kerja",
    "/e-arsip",                  
    "/arsip",                    
    "/kalender",
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


const hasMenuAccess = (pathname, userData, menus) => {
  const matchedMenu = menus.find((menu) => menu.path === pathname);

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

  if (PUBLIC_ROUTES.includes(normalizedPath)) {
    return true;
  }

  if (userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) {
    return true;
  }

  if (ADMIN_ONLY_ROUTES.some((route) => normalizedPath === route)) {
    return userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN;
  }

  if (normalizedPath.startsWith("/monitoring")) {
    return userRole === ROLES.USER || userRole === ROLES.PIC;
  }

  const allowedRoutes = ROLE_ROUTES[userRole];
  if (allowedRoutes === "*") return true;
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    if (
      normalizedPath === "/satuan-kerja" || 
      normalizedPath.startsWith("/pengajuan") || 
      normalizedPath === "/e-arsip" ||
      normalizedPath.startsWith("/e-arsip/") ||
      normalizedPath.startsWith("/arsip/") ||
      normalizedPath.startsWith("/report/") ||
      normalizedPath === "/kalender"
    ) {
      return true;
    }
  }

  if (hasRouteAccess(normalizedPath, allowedRoutes)) {
    if (userRole === ROLES.USER || userRole === ROLES.PIC) {
      return hasMenuAccess(normalizedPath, userData, menus);
    }
    return true;
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
      return "/monitoring";
    default:
      return "/";
  }
};

export const getRedirectPathOnDenied = (pathname, userRole) => {
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    const parts = pathname.split("/").filter(Boolean);
    if ((parts[0] === "/satuan-kerja" || parts[0] === "arsip") && parts.length > 2) {
      return "/" + parts.slice(0, -1).join("/");
    }

    return "/monitoring";
  }

  return getDefaultRedirectPath(userRole);
};