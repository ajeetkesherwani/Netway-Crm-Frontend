const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get Ticket Reply Option List
export const getTicketResolutionOptions = async () => {
    const res = await fetch(`${BASE_URL}/ticketResolution/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
};

// Create Option
export const createTicketResolutionOption = async (data) => {
    const res = await fetch(`${BASE_URL}/ticketResolution/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};

// Update Ticket Reply Option
export const updateTicketResolutionOption = async (id, data) => {
    const res = await fetch(`${BASE_URL}/ticketResolution/update/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};

// Delete Ticket Reply Option
export const deleteTicketResolutionOption = async (id) => {
    const res = await fetch(`${BASE_URL}/ticketResolution/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
};
