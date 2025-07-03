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
          element={token ? <Navigate to="/satuan-kerja" /> : <LoginPage />}
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
      </Routes>
    </>
  );
}

export default App;
