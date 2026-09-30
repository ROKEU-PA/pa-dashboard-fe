const API_BASE_URL = "http://192.168.223.166";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request gagal dengan status ${response.status}`
    );
  }

  return data;
};

export const getProfilPemagang = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/intern/intern-profiles`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

export const createProfilPemagang = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/api/intern/intern-profiles`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        campus_origin: data.campus_origin,
        position: data.position,
        phone_number: data.phone_number,
      }),
    }
  );

  return handleResponse(response);
};

export const updateProfilPemagang = async (id, data) => {
  const response = await fetch(
    `${API_BASE_URL}/api/intern/intern-profiles/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        campus_origin: data.campus_origin,
        position: data.position,
        phone_number: data.phone_number,
      }),
    }
  );

  return handleResponse(response);
};

export const deleteProfilPemagang = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/api/intern/intern-profiles/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};