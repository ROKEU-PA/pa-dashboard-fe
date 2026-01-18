import api from "@/api/axios";

export const login = async (email, password) => {
  const res = await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );

  return res.data;
};
