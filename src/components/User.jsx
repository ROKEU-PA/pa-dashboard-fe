import { useAuth } from "@/contexts/AuthContexts";
import React, { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/services/APIHelper";
import { cryptoEncrypter } from "@/services/GeneralHelper";
import {
  UserCog,
  UserCheck,
  User as UserIcon,
  Power,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/contexts/AppContext";

const User = ({
  className = "",
  name,
  previlege,
  username,
  role,
  access_code,
  id,
}) => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
  });
  const { setAuth } = useAuth();

  const dropdownRef = useRef(null);

  const getRoleIcon = (roleName) => {
    const lowerRole = roleName?.toLowerCase();
    if (
      lowerRole === "admin" ||
      lowerRole === "superadmin" ||
      lowerRole === "super_admin"
    ) {
      return <UserCog size={20} className="text-emerald-600" />;
    }
    if (lowerRole === "pic") {
      return <UserCheck size={20} className="text-blue-600" />;
    }
    return <UserIcon size={20} className="text-slate-600" />;
  };

  // 2. Logic buat warna Background Lingkaran Icon
  const getRoleBackground = (roleName) => {
    const lowerRole = roleName?.toLowerCase();
    if (
      lowerRole === "admin" ||
      lowerRole === "superadmin" ||
      lowerRole === "super_admin"
    ) {
      return "bg-emerald-100";
    }
    if (lowerRole === "pic") {
      return "bg-blue-100";
    }
    return "bg-slate-100";
  };

  // 3. Logic buat nampilin Label Text di bawah nama
  const getRoleLabel = (roleName) => {
    const lowerRole = roleName?.toLowerCase();
    if (
      lowerRole === "admin" ||
      lowerRole === "superadmin" ||
      lowerRole === "super_admin"
    ) {
      return "Administrator";
    }
    if (lowerRole === "pic") {
      return "Person in Charge (PIC)";
    }
    if (lowerRole === "user") {
      return "User Satker";
    }
    return "Guest";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        kode_biro: username,
        role: role,
        nama: name,
        access: JSON.stringify(access_code),
        password: cryptoEncrypter(passwordForm.new_password),
      };

      const result = await apiRequest({
        url: `/user/edit/${id}`,
        method: "POST",
        options: {
          body: payload,
        },
      });

      toast.success("Password berhasil diubah!");
      setOpen(false);
      setPasswordForm({ new_password: "" });
      setAuth({
        accessToken: null,
        user: null,
      });
    } catch (err) {
      toast.error("Gagal mengubah password.");
    }
  };

  const logout = () => {
    setAuth({
      accessToken: null,
      user: null,
    });
    navigate("./");
  };

  return (
    <div className={`${className}  relative`} ref={dropdownRef}>
      <div
        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all duration-200 select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col text-right hidden sm:flex">
          <span className="text-sm font-bold text-slate-800 leading-tight">
            {userData.name || "User"}
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {getRoleLabel(role)}
          </span>
        </div>

        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors ${getRoleBackground(role)}`}
        >
          {getRoleIcon(role)}
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {open && (
        <div className="flex flex-col gap-6 px-4 absolute right-0 mt-1 w-fit bg-white shadow-lg rounded-md p-4 z-50">
          <div
            onClick={() => logout()}
            className="cursor-pointer flex gap-4 text-red-600 hover:bg-red-100 p-3 rounded"
          >
            <Power />
            <span className="font-bold">logout</span>
          </div>
        </div>
        // <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 z-50">
        //   <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        //     <div>
        //       <p className="font-bold text-sm">{name}</p>
        //       <p className="text-xs text-gray-500">{previlege}</p>
        //     </div>
        //     <input
        //       type="password"
        //       placeholder="Password Baru"
        //       required
        //       className="border px-2 py-1 rounded text-sm"
        //       value={passwordForm.new_password}
        //       onChange={(e) =>
        //         setPasswordForm((prev) => ({
        //           ...prev,
        //           new_password: e.target.value,
        //         }))
        //       }
        //     />
        //     <button
        //       type="submit"
        //       className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
        //     >
        //       Ganti Password
        //     </button>
        //   </form>
        // </div>
      )}
    </div>
  );
};

export default User;
