const BASE_URL = import.meta.env.VITE_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

async function parseResponse(response, fallbackMessage) {
  const text = await response.text();
  let data;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!response.ok) {
        throw new Error(text || fallbackMessage);
      }
      return text;
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        fallbackMessage ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

const getEndpoint = (id) => {
  const endpoint = `${BASE_URL.replace(/\/$/, "")}/stockProductCategory`;
  return id === undefined ? endpoint : `${endpoint}/${encodeURIComponent(id)}`;
};

export async function getStockProductCategories() {
  const response = await fetch(getEndpoint(), {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await parseResponse(response, "Failed to fetch product categories");
  const categories =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.data) && data.data) ||
    data?.data?.stockProductCategories ||
    data?.data?.categories ||
    data?.stockProductCategories ||
    data?.categories;

  if (!Array.isArray(categories)) {
    throw new Error("The product categories response has an unexpected format");
  }

  return categories;
}

export async function createStockProductCategory(payload) {
  const response = await fetch(getEndpoint(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response, "Failed to create product category");
}

export async function updateStockProductCategory(id, payload) {
  const response = await fetch(getEndpoint(id), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response, "Failed to update product category");
}

export async function deleteStockProductCategory(id) {
  const response = await fetch(getEndpoint(id), {
    method: "DELETE",
    headers: getHeaders(),
  });
  return parseResponse(response, "Failed to delete product category");
}
