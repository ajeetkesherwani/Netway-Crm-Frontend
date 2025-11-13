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

//get all user list
// export const getAllUsers = async () => {
//   const res = await fetch(`${BASE_URL}/user/list`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch users");
//   return res.json(); // ✅ returns { status, message, data: [] }
// };

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
// export const updateTicket = async (id, ticketData) => {
//   const res = await fetch(`${BASE_URL}/ticket/status/${id}`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: ticketData, // FormData
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to update ticket");
//   return data;
// };
// ✅ Update ticket status
export const updateTicket = async (id, ticketData) => {
  const res = await fetch(`${BASE_URL}/ticket/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(ticketData), // ✅ Send JSON body
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update ticket");
  return data;
};

// ✅ deleteTicket API (fixed)
export const deleteTicket = async (id) => {
  const res = await fetch(`${BASE_URL}/ticket/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete ticket");
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
  const res = await fetch(`${BASE_URL}/ticketReply/list/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch replies");
  return data;
};


// // ✅ Create Ticket Reply
// export const createTicketReply = async (ticketId, payload) => {
//   const res = await fetch(`${BASE_URL}/ticketReply/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({ ticketId, ...payload }),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to create reply");
//   return data;
// };


// ✅ Fetch Timeline
export const getTicketTimeline = async (ticketId) => {
  const res = await fetch(`${BASE_URL}/timeLine/list/${ticketId}`, {
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
  const res = await fetch(`${BASE_URL}/ticket/view/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
};

// Get Staff Role List
export const getStaffRoleList = async () => {
  const res = await fetch(`${BASE_URL}/common/staff/roleList`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
};

//asign to staff
export const assignTicketToStaff = async (body) => {
  const res = await fetch(`${BASE_URL}/ticketAssign/toStaff`, {
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
// export const updateTicketDetails = async (ticketId, body) => {
//   const res = await fetch(`${BASE_URL}/ticket/update/${ticketId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(body),
//   });
//   return res.json();
// };



// ✅ Get Category List
export const getCategoryList = async () => {
  const res = await fetch(`${BASE_URL}/category/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  return data;
};

// ✅ Get Admin Ticket Details (with replies and timeline)
export const getAdminTicketDetails = async (ticketId) => {
  const res = await fetch(`${BASE_URL}/ticket/view/${ticketId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch admin ticket details");
  return data; // { status, data: { ticket, replies, timeline } }
};

// ✅ Reassign Ticket To Staff
export const reassignTicketToStaff = async (body) => {
  const res = await fetch(`${BASE_URL}/ticketAssign/toStaff/reAssign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body), // body = { ticketId, assignToId }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reassign ticket");
  return data;
};

// ✅ Get Fix Ticket Dropdown Options
export const getTicketResolutionOptions = async () => {
  const res = await fetch(`${BASE_URL}/ticketResolution/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch resolution options");
  return data; // { status, data: [{ _id, name }, ...] }
};

// ✅ Get Ticket Reply Dropdown Options
export const getTicketReplyOptions = async () => {
  const res = await fetch(`${BASE_URL}/ticketReplyOption/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch reply options");
  return data; // { status, data: [{ _id, name }, ...] }
};

// ✅ UPDATED: send all editable fields using FormData
export const updateTicketDetails = async (ticketId, data) => {
  try {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null)
        formData.append(key, data[key]);
    }

    const res = await fetch(`${process.env.REACT_APP_API}/ticket/update/${ticketId}`, {
      method: "PATCH",
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error("Error updating ticket:", err);
    throw err;
  }
};


// ✅ Create a new ticket reply option
export const createTicketReply = async (data) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/admin/ticketReplyOption/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // <-- this sends { optionText: "..." }
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Error creating ticket reply option:", err);
    return { status: false, message: "Request failed" };
  }
};
