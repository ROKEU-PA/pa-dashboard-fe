import {
  Building,
  Layers,
  UserRoundCog,
  AlignEndHorizontal,
  TrendingUpDown,
  FolderCheck,
  HandCoins,
  FileChartColumn,
  Package,
  BookUser,
  Settings,
  GaugeCircle,
  LayoutDashboard,
  MessageSquare,
  Network,
  Archive,
  Axis3D,
  Table,
  CircleDollarSign,
  Calendar,
} from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard Utama",
    path: "/dashboard-utama",
    icon: <LayoutDashboard strokeWidth={3} />,
  },
  {
    name: "PTUK",
    path: "/ptuk/tuntutan-ganti-rugi",
    adminOnly: true,
    children: [
      {
        name: "Tuntutan Ganti Rugi",
        path: "/ptuk/tuntutan-ganti-rugi",
        icon: <Building strokeWidth={3} />,
      },
    ],
    icon: <Layers strokeWidth={3} />,
  },
  {
    name: "Pelaksanaan Anggaran",
    path: "/pelaksanaan-anggaran",
    children: [
      {
        name: "Tanda Terima SPP",
        path: "/tanda-terima",
        icon: <Table strokeWidth={3} />,
      },
      {
        name: "Pengajuan SPP",
        path: "/satuan-kerja/pengajuan",
        icon: <FolderCheck strokeWidth={3} />,
      },
      {
        name: "IKPA",
        path: "/ikpa",
        icon: <AlignEndHorizontal strokeWidth={3} />,
      },
      {
        name: "Realisasi",
        path: "/realisasi",
        icon: <CircleDollarSign strokeWidth={3} />,
      },
      {
        name: "Arsip SPM",
        path: "/satuan-kerja",
        icon: <Archive strokeWidth={3} />,
      },
      {
        name: "Kompilasi",
        path: "/compilation",
        icon: <TrendingUpDown strokeWidth={3} />,
        adminOnly: true,
      },
      {
        name: "LLAT",
        path: "/llat",
        icon: <Calendar strokeWidth={3} />,
      },
    ],
    icon: <HandCoins strokeWidth={3} />,
  },
  {
    name: "Barang Milik Negara",
    adminOnly: true,
    // path: "/dashboard/barang-milik-negara",
    path: "/barang-milik-negara",
    children: [
      // {
      //   name: "Dashboard",
      //   path: "/barang-milik-negara",
      //   icon: <Axis3D strokeWidth={3} />,
      // },
    ],
    icon: <Package strokeWidth={3} />,
  },
  {
    name: "Akuntansi Pelaporan",
    adminOnly: true,
    path: "/akuntansi-pelaporan",
    children: [
      // {
      //   name: "Dashboard",
      //   path: "/dashboard/akuntansi-pelaporan",
      //   icon: <Axis3D strokeWidth={3} />,
      // },
    ],
    icon: <FileChartColumn strokeWidth={3} />,
  },
  {
    name: "Tata Usaha",
    adminOnly: true,
    path: "/tata-usaha",
    children: [
      {
        name: "Dashboard",
        path: "/tata-usaha",
        icon: <Axis3D strokeWidth={3} />,
      },
    ],
    icon: <BookUser strokeWidth={3} />,
  },
  {
    name: "Struktur Organisasi",
    path: "/dashboard/struktur-organisasi",
    icon: <Network strokeWidth={3} />,
  },
  {
    name: "Helpdesk",
    path: "/dashboard/helpdesk",
    icon: <MessageSquare strokeWidth={3} />,
  },
  {
    name: "Management",
    icon: <Settings strokeWidth={3} />,
    children: [
      {
        name: "User Manage",
        path: "/user-management",
        icon: <UserRoundCog strokeWidth={3} />,
      },
      {
        name: "Dashboard Manage",
        path: "/dashboard-management",
        icon: <GaugeCircle strokeWidth={3} />,
      },
    ],
    adminOnly: true,
  },
];
