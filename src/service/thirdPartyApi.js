const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getThirdPartyApiConfigurations() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/third-party-api`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to fetch API configurations"
    );
  }

  return result?.data || [];
}
