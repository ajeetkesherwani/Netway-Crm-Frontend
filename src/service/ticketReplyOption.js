const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get Ticket Reply Option List
export const getTicketReplyOptions = async () => {
    const res = await fetch(`${BASE_URL}/ticketReplyOption/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
};

// Create Option
export const createTicketReplyOption = async (data) => {
    const res = await fetch(`${BASE_URL}/ticketReplyOption/create`, {
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
export const updateTicketReplyOption = async (id, data) => {
    const res = await fetch(`${BASE_URL}/ticketReplyOption/update/${id}`, {
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
export const deleteTicketReplyOption = async (id) => {
    const res = await fetch(`${BASE_URL}/ticketReplyOption/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
};
