const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");
const PAYMENT_MODE_PATH = "/paymentmode";

async function requestPaymentMode(path = "", options = {}) {
  const response = await fetch(`${BASE_URL}${PAYMENT_MODE_PATH}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.status === false || data?.success === false) {
    throw new Error(
      data?.message || `Payment mode request failed with status ${response.status}.`
    );
  }

  return data;
}

export async function getPaymentModes() {
  const response = await requestPaymentMode();
  const candidates = [
    response?.data,
    response?.data?.data,
    response?.data?.paymentModes,
    response?.paymentModes,
    response?.result,
  ];
  const modes = candidates.find((candidate) => Array.isArray(candidate));

  if (!modes) {
    throw new Error("The payment mode response did not contain a list.");
  }

  return modes;
}

export async function getPaymentMode(id) {
  const response = await requestPaymentMode(`/${encodeURIComponent(id)}`);
  const mode =
    response?.data?.data ||
    response?.data?.paymentMode ||
    response?.data ||
    response?.paymentMode;

  if (!mode || typeof mode !== "object" || Array.isArray(mode)) {
    throw new Error("The payment mode response did not contain a record.");
  }

  return mode;
}

export function createPaymentMode(payload) {
  return requestPaymentMode("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePaymentMode(id, payload) {
  return requestPaymentMode(`/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deletePaymentMode(id) {
  return requestPaymentMode(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
