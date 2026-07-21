let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Session Expired");
      }

      const result = await response.json();
      const newAccessToken = result?.data?.access_token;
      
      window.dispatchEvent(new CustomEvent("onTokenRefreshed", { detail: newAccessToken }));
      
      return newAccessToken;
    } catch (error) {
      window.dispatchEvent(new Event("forceLogout"));
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export async function fetchHelper(url, method, body, customOptions = {}) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify({ ...body }),
      ...customOptions,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchHelperAuth(url, method = "GET", token, body = null, responseType = "json") {
  const headers = {
    "Authorization": `Bearer ${token}`,
    ...(responseType !== "blob" && { "Content-Type": "application/json" })
  };

  const fetchOptions = {
    method: method,
    headers: headers,
    credentials: "omit",
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      const newToken = await refreshAccessToken();

      fetchOptions.headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, fetchOptions);
    }

    if (!response.ok) {
      const errorData = responseType === "blob" ? await response.text() : await response.json();
      throw new Error(errorData?.message || "Request failed");
    }

    if (responseType === "blob") {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchHelperGET(url, method, token, responseType) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${token}`,
        ...(responseType !== "blob" && { "Content-Type": "application/json" })
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData.message || "Login failed");
    }
    if (responseType === "blob") {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
