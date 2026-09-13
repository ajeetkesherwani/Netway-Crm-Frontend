const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

async function parseResponse(res) {
  const text = await res.text().catch(() => null);
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok)
      throw new Error(
        data?.message ||
          data?.error ||
          text ||
          `Request failed with ${res.status}`
      );
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Request failed with ${res.status}`);
    return text;
  }
}

// Create a new banner
export async function createBanner(payload) {
  const token = getToken();
  
  // Determine if payload is FormData
  const isFormData = payload instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}/banner/create`, {
    method: "POST",
    headers,
    body: isFormData ? payload : JSON.stringify(payload),
  });
  return await parseResponse(res);
}

// Get list of banners
export async function getBanners(params = {}) {
  const token = getToken();
  
  // Construct query string
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== "") {
      query.append(key, params[key]);
    }
  });
  
  const queryString = query.toString() ? `?${query.toString()}` : "";
  
  const res = await fetch(`${BASE_URL}/banner/list${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}

// Get Single Banner
export async function getBannerById(id) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/banner/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}

// Update a banner by ID
export async function updateBanner(id, payload) {
  const token = getToken();
  
  const isFormData = payload instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}/banner/update/${id}`, {
    method: "PUT",
    headers,
    body: isFormData ? payload : JSON.stringify(payload),
  });
  return await parseResponse(res);
}

// Delete a banner by ID
export async function deleteBanner(id) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/banner/delete/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return await parseResponse(res);
}
