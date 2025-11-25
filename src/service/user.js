const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

//get all package list
export const getAllUserList = async () => {
  const res = await fetch(`${BASE_URL}/user/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();

};

// Create package
export const createUser = async (payload) => {
  console.log("payload",payload);
  let options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: payload,
  };
  // If not FormData, send as JSON
  if (!(payload instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(payload);
  }
  const res = await fetch(`${BASE_URL}/user/create`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create user");
  return data;
};
// get UserDetails
export const getUserDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user Details");
  return res.json();
};


// export const getUserDetails = async (id) => {
//   const res = await fetch(`${BASE_URL}/api/admin/customer/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to fetch customer details");
//   return data;
// };

// update the users
export const updateUser = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/user/update/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update customer");
  }

  return data;
};
// export const updateUser = async (id, userData) => {
//   const res = await fetch(`${BASE_URL}/user/update/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(userData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to update customer");
//   return data;
// };

// In ../../service/user.js
export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/user/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete user");
  return data;
};

//-----------------------------------------------------this api is used to update the status of the customer -----------------------------------------------------
export const updateUserStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/userManage/update-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ userId: id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user status");
  return data;
};
//-------------------------------------------------------this api for purchase plan -------------------------------------------------------
export const getPurchasedPlanList = async (userId, page, limit, search) => {
  const url = `${BASE_URL}/purchasedPlan/list?userId=${userId}&page=${page}&limit=${limit}&search=${search}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load purchase plans");
  return data;
};



// Global user search
// export const searchUsersGlobaly = async (query) => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/common/user/Global/details/${query}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//       }
//     );
//     return await res.json();
//   } catch (error) {
//     console.error("Global user search error:", error);
//     return { status: false, data: [] };
//   }
// };

//serach users globally 
export const searchUsers = async (query) => {
  if (!query?.trim()) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/common/user/details?query=${(query.trim())}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("searchUsers error:", error);
    return [];
  }
};

// export const searchUsers = async (query) => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/common/user/details?query=${query}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//       }
//     );

//     return await res.json();
//   } catch (error) {
//     console.error("User search error:", error);
//     return { status: false, data: [] };
//   }
// };


//zone listing
export const getAllZoneList = async () => {
  const res = await fetch(`${BASE_URL}/zone/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Area");
  return res.json();

};

export const getUserFullDetails = async (userId) => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const res = await fetch(`${BASE_URL}/user/fullDetails/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};