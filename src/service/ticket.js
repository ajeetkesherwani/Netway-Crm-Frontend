const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

// Get all ticket list with pagination, search, and filter
// src/service/ticket.js
export const getAllTicketListWithFilter = async (queryParams = "") => {
  const url = queryParams
    ? `${BASE_URL}/ticket/list?${queryParams}`
    : `${BASE_URL}/ticket/list`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tickets");
  }

  return data;
};

export const getAllTicketList = async (
  page = 1,
  limit = 10,
  search = "",
  filter = ""
) => {
  const query = new URLSearchParams({
    page,
    limit,
    search,
    ...(filter && { filter }),
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

export const getAllRolesList = async () => {
  const res = await fetch(`${BASE_URL}/common/staff/allRoles`, {
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
export const getReassignTicketList = async (queryString) => {
  const res = await fetch(
    `${BASE_URL}/common/reassign/ticket/list?${queryString}`,
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
// export const getTicketReplies = async (ticketId) => {
//   const res = await fetch(`${BASE_URL}/ticketReply/list/${ticketId}`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to fetch replies");
//   return data;
// };

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
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch admin ticket details");
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
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch resolution options");
  return data; // { status, data: [{ _id, name }, ...] }
};

// ✅ Get Ticket Reply Dropdown Options
// export const getTicketReplyOptions = async () => {
//   const res = await fetch(`${BASE_URL}/ticketReplyOption/list`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to fetch reply options");
//   return data; // { status, data: [{ _id, name }, ...] }
// };

// ✅ UPDATED: send all editable fields using FormData
export const updateTicketDetails = async (ticketId, data) => {
  try {
    console.log("Updating ticket with data:", data);
    const res = await fetch(`${BASE_URL}/ticket/update/${ticketId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`, // agar token chahiye
      },
      body: data,
    });

    return await res.json();
  } catch (err) {
    console.error("Error updating ticket:", err);
    throw err;
  }
};

// ✅ Create a new ticket reply option
// service/ticket.js

export const createTicketReplyOption = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/ticketReplyOption/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // agar token chahiye
      },
      body: JSON.stringify(data),
    });

    // Agar backend sirf ID return karta hai (string), to handle karo
    if (!res.ok) {
      const errorText = await res.text();
      return {
        status: false,
        message: errorText || "Failed to create reply option",
      };
    }

    const text = await res.text();
    if (!text) return { status: true, data: null };

    try {
      return { status: true, data: JSON.parse(text) };
    } catch (e) {
      // Agar sirf ID aaya (string), to bhi success maan lo
      return { status: true, data: { _id: text.replace(/"/g, "") } };
    }
  } catch (err) {
    console.error("Error creating reply option:", err);
    return { status: false, message: "Network error" };
  }
};
// export const createTicketReply = async (data) => {
//   try {
//     const res = await fetch(`${BASE_URL}/ticketReplyOption/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data), // <-- this sends { optionText: "..." }
//       }
//     );
//     return await res.json();
//   } catch (err) {
//     console.error("Error creating ticket reply option:", err);
//     return { status: false, message: "Request failed" };
//   }
// };

// Dropdown ke liye quick reply options
export const getTicketReplyOptions = async () => {
  const res = await fetch(`${BASE_URL}/ticketReplyOption/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // console.log("Fetched ticket reply options:", res);
  if (!res.ok) {
    const err = await res.text();
    return { status: false, message: err || "Failed" };
  }

  // Parse the JSON response
  const data = await res.json();

  // console.log("Ticket reply options data:", data);

  // Return the data correctly
  if (data.status) {
    return { data: data.data }; // Assuming 'data' contains the actual reply options
  } else {
    return { status: false, message: data.message || "Failed" };
  }
};

// TICKET REPLY CREATE — YEHI CHAHIE THA TUMHE!
export const createTicketReply = async (ticketId, userId, description) => {
  try {
    const res = await fetch(`${BASE_URL}/ticketReply/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },

      body: JSON.stringify({
        ticket: ticketId,
        user: userId,
        description: description.trim(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { status: false, message: err || "Failed" };
    }
    return { status: true };
  } catch (err) {
    return { status: false, message: "Network error" };
  }
};

// REPLIES FETCH KARNE KE LIYE
export const getTicketReplies = async (ticketId) => {
  try {
    // Construct the URL dynamically
    const res = await fetch(`${BASE_URL}/ticketReply/list/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Check if the response is OK (2xx status code)
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    // Parse the JSON response
    const data = await res.json();

    console.log("Ticket reply options data:", data);

    // Handle the response data
    if (data.status) {
      return { data: data.data }; // Assuming 'data' contains the actual reply options
    } else {
      return { status: false, message: data.message || "Failed" };
    }
  } catch (err) {
    console.error("Error fetching ticket replies:", err);
    return { status: false, message: err.message || "Network error" };
  }
};
