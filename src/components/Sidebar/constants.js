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
    icon: <LayoutDashboard />,
  },
  {
    name: "PTUK",
    path: "/ptuk/tuntutan-ganti-rugi",
    adminOnly: true,
    children: [
      {
        name: "Tuntutan Ganti Rugi",
        path: "/ptuk/tuntutan-ganti-rugi",
        icon: <Building />,
      },
    ],
    icon: <Layers />,
  },
  {
    name: "Pelaksanaan Anggaran",
    path: "/pelaksanaan-anggaran",
    children: [
      {
        name: "Tanda Terima SPP",
        path: "/tanda-terima",
        icon: <Table />,
      },
      {
        name: "Pengajuan SPP",
        path: "/satuan-kerja/pengajuan",
        icon: <FolderCheck />,
      },
      {
        name: "IKPA",
        path: "/ikpa",
        icon: <AlignEndHorizontal />,
      },
      {
        name: "Realisasi",
        path: "/realisasi",
        icon: <CircleDollarSign />,
      },
      {
        name: "Arsip SPM",
        path: "/satuan-kerja",
        icon: <Archive />,
      },
      {
        name: "Kompilasi",
        path: "/compilation",
        icon: <TrendingUpDown />,
        adminOnly: true,
      },
      {
        name: "LLAT",
        path: "/llat",
        icon: <Calendar />,
      },
    ],
    icon: <HandCoins />,
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
      //   icon: <Axis3D />,
      // },
    ],
    icon: <Package />,
  },
  {
    name: "Akuntansi Pelaporan",
    adminOnly: true,
    path: "/akuntansi-pelaporan",
    children: [
      // {
      //   name: "Dashboard",
      //   path: "/dashboard/akuntansi-pelaporan",
      //   icon: <Axis3D />,
      // },
    ],
    icon: <FileChartColumn />,
  },
  {
    name: "Tata Usaha",
    adminOnly: true,
    path: "/tata-usaha",
    children: [
      {
        name: "Dashboard",
        path: "/tata-usaha",
        icon: <Axis3D />,
      },
    ],
    icon: <BookUser />,
  },
  {
    name: "Struktur Organisasi",
    path: "/dashboard/struktur-organisasi",
    icon: <Network />,
  },
  {
    name: "Helpdesk",
    path: "/dashboard/helpdesk",
    icon: <MessageSquare />,
  },
  {
    name: "Management",
    icon: <Settings />,
    children: [
      {
        name: "User Manage",
        path: "/user-management",
        icon: <UserRoundCog />,
      },
      {
        name: "Dashboard Manage",
        path: "/dashboard-management",
        icon: <GaugeCircle />,
      },
    ],
    adminOnly: true,
  },
];
