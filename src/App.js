import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import AppLayout from "./Layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import ListSatuanKerjaPage from "./pages/ListSatuankerja";
import { ToastContainer } from "react-toastify";
import CompilationPage from "./pages/Compilation";
import SoonPage from "./pages/Soon";
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
import LLATPage from "./pages/LLAT";
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
import YearSelectionPage from "./pages/ListSatuankerja/year";
import ArchivePage from "./pages/ListSatuankerja/arsip";
import MonitoringPage from "./pages/Monitoring";
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
        <Route
          path="/tata-usaha/pengambilan-persediaan"
          element={<InventoryTaking />}
        />
        <Route path="/inventaris-kantor/admin" element={<InventoryTakingA />} />
        {listMenu.map((data) => (
          <Route
            key={data?.id}
            path={`${data?.path}`}
            element={
              <PrivateRoute>
                <AppLayout isAdmin={isAdmin}>
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
              <AppLayout isAdmin={isAdmin}>
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
                <AppLayout isAdmin={isAdmin} title={`Pengajuan`}>
                  <ListSatuanKerjaPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
        ))}

        <Route
          path="/e-arsip"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="E-Arsip">
                <YearSelectionPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/e-arsip/:tahun"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Satuan Kerja">
                <MenuPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/arsip/:tahun/:satker"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Arsip">
                <ArchivePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/compilation"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <CompilationPage />
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
          path="/soon"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <SoonPage />
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
              <AppLayout isAdmin={isAdmin} title="Pelaksanaan Anggaran">
                <IkpaPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/realisasi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Pelaksanaan Anggaran">
                <RealisasiPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/kalender"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Pelaksanaan Anggaran">
                <LLATPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin} title="Monitoring E-SPP">
                <MonitoringPage />
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
      </Routes>
    </>
  );
}

export default App;
