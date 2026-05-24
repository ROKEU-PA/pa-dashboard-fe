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
  ],

  [ROLES.USER]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/satuan-kerja",
    "/satuan-kerja/pengajuan",
    "/e-arsip",                  
    "/arsip",                    
    "/llat",
  ],

  [ROLES.PIC]: [
    "/dashboard/pelaksanaan-anggaran",
    "/pelaksanaan-anggaran",
    "/satuan-kerja",
    "/satuan-kerja/pengajuan",
    "/e-arsip",                  
    "/arsip",                    
    "/llat",
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

const getCleanedPathForMenuMatch = (pathname) => {
  if (pathname.startsWith("/satuan-kerja/pengajuan/")) {
    const parts = pathname.split("/").filter(Boolean);
    return `/satuan-kerja/${parts[parts.length - 1]}`;
  }
  if (pathname.startsWith("/arsip/")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 3) {
      return `/satuan-kerja/${parts[2]}`; 
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

  if (PUBLIC_ROUTES.includes(normalizedPath)) {
    return true;
  }

  if (userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) {
    return true;
  }

  if (ADMIN_ONLY_ROUTES.some((route) => normalizedPath === route)) {
    return userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN;
  }

  if (normalizedPath.startsWith("/tanda-terima")) {
    return userRole === ROLES.USER || userRole === ROLES.PIC;
  }

  const allowedRoutes = ROLE_ROUTES[userRole];
  if (allowedRoutes === "*") return true;
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    if (
      normalizedPath === "/satuan-kerja/pengajuan" || 
      normalizedPath === "/e-arsip" ||
      normalizedPath.startsWith("/e-arsip/")||
      normalizedPath === "/llat" ||             
      normalizedPath.startsWith("/llat/")
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
      return "/satuan-kerja/pengajuan";
    default:
      return "/";
  }
};

export const getRedirectPathOnDenied = (pathname, userRole) => {
  if (userRole === ROLES.USER || userRole === ROLES.PIC) {
    const parts = pathname.split("/").filter(Boolean);
    if ((parts[0] === "satuan-kerja" || parts[0] === "arsip") && parts.length > 2) {
      return "/" + parts.slice(0, -1).join("/");
    }

    return "/satuan-kerja/pengajuan";
  }

  return getDefaultRedirectPath(userRole);
};