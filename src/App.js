import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import AppLayout from "./Layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import ListSatuanKerjaPage from "./pages/ListSatuankerja";
import { ToastContainer } from "react-toastify";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import UserManagementPage from "./pages/UserManagement";
import MenuPage from "./pages/Menu";
import { AppContext } from "./contexts/AppContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/Dashboard";
import DashboardManagementPage from "./pages/DashboardManagement";
import IkpaPage from "./pages/Ikpa";
import MainDashboard from "./pages/MainDashboard";
import BudgetExecution from "./pages/BudgetExecution";
import StateProperty from "./pages/StateProperty";
import Administrator from "./pages/Administrator";
import RealisasiPage from "./pages/Realisasi";
import ReportingAccounting from "./pages/ReportingAccounting";
import CalendarPage from "./pages/Calendar";
import { useAuth } from "./contexts/AuthContexts";
import PTUKDashboard from "./pages/PTUKDashboard";
import PTUKLHP from "./pages/PTUK/LHP";
import StateLosses from "./pages/PTUK/StateLosses";
import PNBP from "./pages/PTUK/PNBP";
import FinancialAdiministrator from "./pages/PTUK/FinancialAdministrator";
import StatusPSP from "./pages/StateProperty/PspStatus";
import KondisiAset from "./pages/StateProperty/assetCondition";
import JumlahJenisBMN from "./pages/StateProperty/typeOfBMN";
import StrukturOrganisasi from "./pages/OrganizationalStructure";
import InventoryTaking from "./pages/InventoryTaking/index";
import InventoryTakingA from "./pages/InventoryTaking/admin";
import AdminMasterDataTU from "./pages/MasterDataTU";
import ArchivePage from "./pages/ListSatuankerja/arsip";
import MonitoringPage from "./pages/Monitoring";
import PerformanceIndicator from "./pages/PerformanceIndicator";
import PengajuanReviewPage from "./pages/ListSatuankerja/PengajuanReviewPage";
import ShowForAll from "./pages/ShowForAll";
import NotFoundPage from "./pages/NotFound";
import IkpaV2Page from "./pages/IkpaV2";
// import "@/PDFWorkerSetup";

function App() {
  const { isAdmin, listMenu, userData } = useContext(AppContext);
  const { auth, isInitializing } = useAuth();
  const isAuthenticated = !!auth?.accessToken;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route
          path="/"
          element={
            isInitializing ? null : isAuthenticated ? (
              <Navigate to="/dashboard-utama" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/dashboard-utama"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Dashboard"
                userName="Administrator"
              >
                <MainDashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pelaksanaan-anggaran"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Pelaksanaan Anggaran"
                userName="Administrator"
              >
                <BudgetExecution />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/barang-milik-negara"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Barang Milik Negara"
                userName="Administrator"
              >
                <StateProperty />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/barang-milik-negara/status-psp"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Barang Milik Negara"
                userName="Administrator"
              >
                <StatusPSP />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/barang-milik-negara/kondisi-aset"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Barang Milik Negara"
                userName="Administrator"
              >
                <KondisiAset />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/barang-milik-negara/jumlah-jenis"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Barang Milik Negara"
                userName="Administrator"
              >
                <JumlahJenisBMN />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tata-usaha"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Tata Usaha"
                userName="Administrator"
              >
                <Administrator />
              </AppLayout>
            </PrivateRoute>
          }
        />
        {/* Dinonaktifkan akan dimigrasikan ke domain baru
        <Route
          path="/tata-usaha/pengambilan-persediaan"
          element={<InventoryTaking />}
        />
        <Route path="/inventaris-kantor/admin" element={<InventoryTakingA />} />
        <Route path="/master-data-tu" element={<AdminMasterDataTU />} /> */}
        
        {listMenu.map((data) => (
          <Route
            key={data?.id}
            path={`${data?.path}`}
            element={
              <PrivateRoute>
                <AppLayout isAdmin={isAdmin} title={'E-SPP'} userName={userData?.name}>
                  <ListSatuanKerjaPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
        ))}
        <Route
          path="/satuan-kerja"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title={"Satuan Kerja"} userName={userData?.name}>
                <MenuPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        {listMenu.map((data) => (
          <Route
            key={data?.id}
            path={(() => {
              const pathParts = data.path.split("/").filter(Boolean);
              const base = "/" + pathParts[0];
              const end = pathParts.slice(1).join("/");
              return `${base}/${end}`;
            })()}
            element={
              <PrivateRoute>
                <AppLayout isAdmin={isAdmin} title={`E-SPP`} userName={userData?.name}>
                  <ListSatuanKerjaPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
        ))}

        <Route
          path="/pengajuan/pengujian/:id"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="E-SPP" userName={userData?.name}>
                <PengajuanReviewPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pengajuan/detail/:id"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="E-SPP" userName={userData?.name}>
                <PengajuanReviewPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/e-arsip"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="E-Arsip" userName={userData?.name}>
                <ArchivePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <UserManagementPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:subPage"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Helpdesk"
                userName="Administrator"
              >
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/struktur-organisasi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Struktur Organisasi">
                <StrukturOrganisasi />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-management"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <DashboardManagementPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ikpa"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Indikator Keuangan Pelaksanaan Anggaran" userName={userData?.name}>
                <IkpaPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/realisasi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Realisasi Anggaran" userName={userData?.name}> 
                <RealisasiPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/kalender"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Kalender" userName={userData?.name}>
                <CalendarPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Monitoring E-SPP" userName={userData?.name}>
                <MonitoringPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/report/sp2d"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="SP2D" userName={userData?.name}>
                <ShowForAll />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/report/ikpa"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="IKPA" userName={userData?.name}>
                <IkpaV2Page />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/report/realisasi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Realisasi Pelaksanaan Anggaran" userName={userData?.name}>
                <ShowForAll />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/akuntansi-pelaporan"
          element={
            <PrivateRoute>
              <AppLayout
                isAdmin={isAdmin}
                title="Akutansi dan Pelaporan"
                userName="Administrator"
              >
                <ReportingAccounting />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/dashboard"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="PTUK">
                <PTUKDashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/lhp-kementrian"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="PTUK">
                <PTUKLHP />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/kerugian-negara"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="PTUK">
                <StateLosses />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/pnbp"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="PTUK">
                <PNBP />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/pengelola-keuangan"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="PTUK">
                <FinancialAdiministrator />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;