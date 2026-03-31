import { apiRequest } from "@/services/APIHelper";

export const fetchMenu = async (token) => {
  try {
    const result = await apiRequest({ url: `/satker/all`, token });
    return result;
  } catch (error) {
    console.error(error);
  }
};
export const fetchUser = async (token) => {
  try {
    const result = await apiRequest({ url: `/user/me`, token });
    return result;
  } catch (error) {
    console.error(error);
  }
};
