import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./Layouts/AppLayout";
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
import PTUKSub1Page from "./pages/PTUKSub1";
import MainDashboard from "./pages/MainDashboard";
import BudgetExecution from "./pages/BudgetExecution";
import StateProperty from "./pages/StateProperty";
import TandaTerimaPage from "./pages/TandaTerima";
import Administrator from "./pages/Administrator";
import RealisasiPage from "./pages/Realisasi";
import ReportingAccounting from "./pages/ReportingAccounting";
import LLATPage from "./pages/LLAT";
// import "@/PDFWorkerSetup";

function App() {
  const { isAdmin, listMenu, userData } = useContext(AppContext);
  const token = localStorage.getItem("token");

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
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
        <Route
          path="/dashboard-utama"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <MainDashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pelaksanaan-anggaran"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <BudgetExecution />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/barang-milik-negara"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <StateProperty />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tata-usaha"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <Administrator />
              </AppLayout>
            </PrivateRoute>
          }
        />
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
          path="/satuan-kerja/:subPage"
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
              return `${base}/pengajuan/${end}`;
            })()}
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
              <AppLayout isAdmin={isAdmin}>
                <DashboardPage />
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
              <AppLayout isAdmin={isAdmin}>
                <IkpaPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/realisasi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <RealisasiPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/llat"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <LLATPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tanda-terima"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <TandaTerimaPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/akuntansi-pelaporan"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <ReportingAccounting />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ptuk/tuntutan-ganti-rugi"
          element={
            <PrivateRoute>
              <AppLayout isAdmin={isAdmin}>
                <PTUKSub1Page />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
