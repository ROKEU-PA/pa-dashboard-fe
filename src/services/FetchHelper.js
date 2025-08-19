export async function fetchHelper(url, method, body ) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify({ ...body }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const result = await response.json();
    return result;
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
