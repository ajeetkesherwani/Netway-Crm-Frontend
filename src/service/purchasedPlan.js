const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// ✅ Fetch purchased plans with optional type filter
export const getPurchasedPlans = async (type = "") => {
    try {
        const res = await fetch(
            `${BASE_URL}/common/user/purchedPlan${type ? `?type=${type}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );

        const data = await res.json();

        if (!res.ok || !data.status) {
            throw new Error(data.message || "Failed to fetch purchased plans");
        }

        return data;
    } catch (err) {
        console.error("Error fetching purchased plans:", err);
        throw err;
    }
};
