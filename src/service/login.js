import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (payload) => {
    console.log(payload, ' data for send in the api');
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // ✅ tell backend we're sending JSON
            },
            body: JSON.stringify(payload) // ✅ convert object to JSON string
        });
        const result = await res.json();
        console.log(result, "res");
        if (result.token) {
            // save JWT and auth flag
            localStorage.setItem("token", result.token);
        }

        return result;

    } catch (err) {
        toast.error(err.message || 'Something went wrong!');
        throw new Error(err.message);
    }
};

//reseller
export const resellerLogin = async (payload) => {
    console.log(payload, ' data for send in the api');
    try {
        const res = await fetch(`${BASE_URL}/auth/reseller/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // ✅ tell backend we're sending JSON
            },
            body: JSON.stringify(payload) // ✅ convert object to JSON string
        });
        const result = await res.json();
        console.log(result, "res");
        if (result.token) {
            // save JWT and auth flag
            localStorage.setItem("token", result.token);
        }

        return result;

    } catch (err) {
        toast.error(err.message || 'Something went wrong!');
        throw new Error(err.message);
    }
};