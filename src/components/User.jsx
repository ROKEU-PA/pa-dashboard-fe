import { useAuth } from "@/contexts/AuthContexts";
import React, { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/services/APIHelper";
import { cryptoEncrypter } from "@/services/GeneralHelper";
import { ChevronDown, Power } from "lucide-react";
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
    console.log(username);
    try {
      const payload = {
        kode_biro: username,
        role: role,
        nama: name,
        access: JSON.stringify(access_code),
        password: cryptoEncrypter(passwordForm.new_password),
      };

      const result = await apiRequest({
        url: `/api/user/edit/${id}`,
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
    <div className={`${className} pb-2 relative`} ref={dropdownRef}>
      <div
        className="flex gap-2 items-center cursor-pointer pb-2"
        onClick={() => setOpen(!open)}
      >
        <div className="w-8 h-8 rounded-full bg-red-500"></div>
        <div className="flex flex-col text-right">
          <span className="text-[14px] font-bold">{userData?.name}</span>
        </div>
        <ChevronDown size={20} />
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
