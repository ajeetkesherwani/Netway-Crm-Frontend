const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get all ticket list with pagination, search, and filter

export const getAllTicketList = async (page = 1, limit = 10, search = "", filter = "") => {
  const query = new URLSearchParams({
    page,
    limit,
    search,
    ...(filter && { filter }), // Only include filter if provided
  }).toString();

  const res = await fetch(`${BASE_URL}/ticket/list?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
  return data;
};


// Get all users
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/webUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};
// Create ticket
export const createTicket = async (ticketData) => {
  const res = await fetch(`${BASE_URL}/ticket/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: ticketData, // FormData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create ticket");
  return data;
};
// // Get ticket details
// export const getTicketDetails = async (id) => {
//   const res = await fetch(`${BASE_URL}/ticket/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error("Failed to fetch ticket details");
//   return res.json();
// };
// Update ticket
export const updateTicket = async (id, ticketData) => {
  const res = await fetch(`${BASE_URL}/ticket/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: ticketData, // FormData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update ticket");
  return data;
};
// 2. Get staff list for "Assign To" dropdown
export const getStaffList = async () => {
  const res = await fetch(`${BASE_URL}/common/staff/roleList`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch staff list");
  return data; // Expected: { data: [{ _id, fullName, email, role }, ...] }
};


// this list for the get ticket category list
export const getTicketCategories = async () => {
  const res = await fetch(`${BASE_URL}/category/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
  return data; // { data: [{ _id, name }, ...] }
};

//get all renewal ticket
export const getReassignTicketList = async (page = 1, limit = 10) => {
  const query = new URLSearchParams({ page, limit }).toString();

  const res = await fetch(
    `${BASE_URL}/common/reassign/ticket/list?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
  return data;
};

// ✅ Fetch Ticket Replies
export const getTicketReplies = async (ticketId) => {
  const res = await fetch(`${BASE_URL}/api/admin/ticketReply/list/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch replies");
  return data;
};


// ✅ Create Ticket Reply
export const createTicketReply = async (ticketId, payload) => {
  const res = await fetch(`${BASE_URL}/api/admin/ticketReply/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ticketId, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create reply");
  return data;
};


// ✅ Fetch Timeline
export const getTicketTimeline = async (ticketId) => {
  const res = await fetch(`${BASE_URL}/api/admin/timeLine/list/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch timeline");
  return data;
};


// Get Ticket Details
export const getTicketDetails = async (ticketId) => {
  const res = await fetch(`${BASE_URL}/api/admin/ticket/list/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
};

// Get Staff Role List
export const getStaffRoleList = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/common/staff/roleList`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
};

//asign to staff
export const assignTicketToStaff = async (body) => {
  const res = await fetch(`${BASE_URL}/api/admin/ticketAssign/toStaff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

//update ticket
export const updateTicketDetails = async (ticketId, body) => {
  const res = await fetch(`${BASE_URL}/api/admin/ticket/update/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

