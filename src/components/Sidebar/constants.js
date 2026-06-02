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
  FileText,
  Box,
  Activity,
  DollarSign,
  Flame,
  BadgeCent,
  ArrowLeftRight,
  ArchiveRestore,
} from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard Utama",
    path: "/dashboard-utama",
    icon: <LayoutDashboard strokeWidth={3} />,
  },
  {
    name: "PTUK",
    path: "/ptuk/dashboard",
    adminOnly: true,
    children: [
      {
        name: "LHP Kementrian",
        path: "/ptuk/lhp-kementrian",
        icon: <DollarSign strokeWidth={3} />,
      },
      {
        name: "Kerugian Negara",
        path: "/ptuk/kerugian-negara",
        icon: <Flame strokeWidth={3} />,
      },
      {
        name: "PNBP",
        path: "/ptuk/pnbp",
        icon: <BadgeCent strokeWidth={3} />,
      },
      {
        name: "Pengelola Keuangan",
        path: "/ptuk/pengelola-keuangan",
        icon: <ArrowLeftRight strokeWidth={3} />,
      },
    ],
    icon: <Layers strokeWidth={3} />,
  },
  {
    name: "Pelaksanaan Anggaran",
    path: "/pelaksanaan-anggaran",
    children: [ 
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
        name: "Kompilasi",
        path: "/compilation",
        icon: <TrendingUpDown strokeWidth={3} />,
        adminOnly: true,
      },
    ],
    icon: <HandCoins strokeWidth={3} />,
  },
  {
    name: "E-SPP",
    path: "/satuan-kerja/pengajuan",
    icon: <FolderCheck strokeWidth={3} />,
  },
  {
    name: "Tanda Terima SPP",
    path: "/tanda-terima",
    icon: <Table strokeWidth={3} />,
  },
  {
    name: "E-Arsip",
    path: "/e-arsip",
    icon: <Archive strokeWidth={3} />,
  },
  {
    name: "LLAT",
    path: "/llat",
    icon: <Calendar strokeWidth={3} />,
  },    
  {
    name: "Barang Milik Negara",
    adminOnly: true,
    // path: "/dashboard/barang-milik-negara",
    path: "/barang-milik-negara",
    children: [
      {
        name: "Status PSP",
        path: "/barang-milik-negara/status-psp",
        icon: <FileText size={18} />,
      },
      {
        name: "Kondisi Aset",
        path: "/barang-milik-negara/kondisi-aset",
        icon: <Activity size={18} />,
      },
      {
        name: "Jumlah Jenis BMN",
        path: "/barang-milik-negara/jumlah-jenis",
        icon: <Box size={18} />,
      },
    ],
    icon: <Package strokeWidth={3} />,
  },
  {
    name: "Akuntansi Pelaporan",
    adminOnly: true,
    path: "/akuntansi-pelaporan",
    children: [
    ],
    icon: <FileChartColumn strokeWidth={3} />,
  },
  {
    name: "Tata Usaha",
    adminOnly: true,
    path: "/tata-usaha",
    children: [
      
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
    name: "Pengambilan Persediaan",
    path: "/tata-usaha/pengambilan-persediaan",
    icon: <ArchiveRestore  strokeWidth={3} />,
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
  {
    name: "Inventaris Kantor",
    icon: <Archive  strokeWidth={3} />,
    path: "/inventaris-kantor/admin",
    adminOnly: true,
  },
  
      
];
