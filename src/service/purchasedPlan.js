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


// // service/invoice.js  (or wherever you keep your service functions)

// export const getInvoices = async (type = "") => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/common/invoiceList${type ? `?type=${type}` : ""}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//       }
//     );

//     const data = await res.json();

//     if (!res.ok || !data.status) {
//       throw new Error(data.message || "Failed to fetch invoices");
//     }

//     return data;
//   } catch (err) {
//     console.error("Error fetching invoices:", err);
//     throw err;
//   }
// };


// //invoice pdf url
// export const downloadInvoicePdf = async (invoiceId, invoiceNumber) => {
//   try {
//     const url = getInvoicePdfUrl(invoiceId);
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });

//     if (!response.ok) throw new Error("Failed to download PDF");

//     const blob = await response.blob();
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `Invoice_${invoiceNumber || invoiceId}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
//   } catch (error) {
//     console.error("Download error:", error);
//     alert("Failed to download PDF. Please try again.");
//   }
// };

// //get invoice details
// export const getInvoiceDetails = async (id) => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/common/invoice/${id}`, 
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//       }
//     );

//     const data = await res.json();

//     if (!res.ok || !data.status) {
//       throw new Error(data.message || "Failed to fetch invoice");
//     }

//     return data.data;  
//   } catch (err) {
//     console.error("Error fetching invoice:", err);
//     throw err;
//   }
// };

//getInvoices
export const getInvoices = async (type = "") => {
  try {
    const res = await fetch(
      `${BASE_URL}/common/invoiceList${type ? `?type=${type}` : ""}`,
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
      throw new Error(data.message || "Failed to fetch invoices");
    }

    return data;
  } catch (err) {
    console.error("Error fetching invoices:", err);
    throw err;
  }
};

// Fetch PDF as blob (for both direct download and viewing)
export const fetchInvoicePdfBlob = async (invoiceId) => {
  try {
    const response = await fetch(`${BASE_URL}/common/invoice/${invoiceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    return await response.blob();
  } catch (error) {
    console.error("PDF fetch error:", error);
    throw error;
  }
};

// Direct download (using the  blob function)
export const downloadInvoicePdf = async (invoiceId, invoiceNumber) => {
  try {
    const blob = await fetchInvoicePdfBlob(invoiceId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${invoiceNumber || invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download PDF");
  }
};

// Optional: If you still need getInvoiceDetails for other purposes
export const getInvoiceDetails = async (id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/common/invoice/${id}`,
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
      throw new Error(data.message || "Failed to fetch invoice");
    }

    return data.data;
  } catch (err) {
    console.error("Error fetching invoice details:", err);
    throw err;
  }
};

//get invoice by userId
 export const getUserInvoices = async (userId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/common/user/invoice/${userId}`,
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
      throw new Error(data.message || "Failed to fetch user invoices");
    }

    return data.data;
  } catch (err) {
    console.error("Error fetching user invoices:", err);
    throw err;
  }
};