const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// ✅ Fetch completed payments
export const getCompletePayments = async () => {
    const res = await fetch(`${BASE_URL}/payment/completePayments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch payments");
    return data;
};

// ✅ Pending payments
export const getPendingPayments = async () => {
    const res = await fetch(`${BASE_URL}/payment/pendingPayments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch pending payments");
    return data;
};
