const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// Get monthly attendance report for a specific staff
export const getMonthlyReport = async (month, year, staffId) => {
  const res = await fetch(`${BASE_URL}/attendance/report?month=${month}&year=${year}&staffId=${staffId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch attendance report");
  return data;
};

// Upsert attendance record by admin
export const upsertAttendance = async (attendanceData) => {
  const res = await fetch(`${BASE_URL}/attendance/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(attendanceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update attendance");
  return data;
};
