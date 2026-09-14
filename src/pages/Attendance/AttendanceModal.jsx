import React, { useState, useEffect } from "react";
import { FaTimes, FaClock } from "react-icons/fa";
import { upsertAttendance } from "../../service/attendance";
import toast from "react-hot-toast";

export default function AttendanceModal({ isOpen, onClose, data, onUpdate }) {
  const [status, setStatus] = useState("Absent");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setStatus(data.attendance?.status || "Absent");
      
      const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toTimeString().substring(0, 5);
      };

      setCheckInTime(formatTime(data.attendance?.checkInTime));
      setCheckOutTime(formatTime(data.attendance?.checkOutTime));
      setAdminNotes(data.attendance?.adminNotes || "");
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  // Dynamically calculate total hours for display
  let displayTotalHours = data?.attendance?.totalHours || 0;
  if (checkInTime && checkOutTime) {
    const [inH, inM] = checkInTime.split(":").map(Number);
    const [outH, outM] = checkOutTime.split(":").map(Number);
    
    let diffMins = (outH * 60 + outM) - (inH * 60 + inM);
    if (diffMins < 0) {
      diffMins += 24 * 60; // handle overnight shifts
    }
    displayTotalHours = (diffMins / 60).toFixed(2);
  } else {
    displayTotalHours = 0;
  }

  // Format 24h to 12h AM/PM for table display
  const format12Hour = (time24) => {
    if (!time24) return "--:--";
    const [h, m] = time24.split(":");
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        staffId: data.staff._id,
        date: data.date,
        status,
        adminNotes,
      };

      if (checkInTime) {
        const ci = new Date(data.date);
        const [h, m] = checkInTime.split(":");
        ci.setHours(h, m, 0);
        payload.checkInTime = ci.toISOString();
      }

      if (checkOutTime) {
        const co = new Date(data.date);
        const [h, m] = checkOutTime.split(":");
        co.setHours(h, m, 0);
        payload.checkOutTime = co.toISOString();
      }

      await upsertAttendance(payload);
      toast.success("Attendance updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(data.date)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, "-");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg font-bold">Attendance - {formattedDate}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-start">
            <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <img 
                src={data.staff.image || "/images/user/user-01.png"} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/images/user/user-01.png"; }}
              />
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded p-1.5 flex items-center gap-1">
                  <span className="text-blue-500 font-semibold text-xs">Name:</span>
                  <span className="uppercase text-xs truncate">{data.staff.name}</span>
                </div>
                <div className="border rounded p-1.5 flex items-center gap-1">
                  <span className="text-blue-500 font-semibold text-xs">ID:</span>
                  <span className="uppercase text-xs truncate">{data.staff.logId}</span>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs text-center">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="py-1.5 px-1 border-r">Shift</th>
                      <th className="py-1.5 px-1 border-r">In</th>
                      <th className="py-1.5 px-1 border-r">Out</th>
                      <th className="py-1.5 px-1 border-r">W.Hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1.5 px-1 border-r">Gen</td>
                      <td className="py-1.5 px-1 border-r">{format12Hour(checkInTime)}</td>
                      <td className="py-1.5 px-1 border-r">{format12Hour(checkOutTime)}</td>
                      <td className="py-1.5 px-1 border-r">{displayTotalHours}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Attendance</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Check In</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Check Out</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">Remark</label>
            <textarea 
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full border rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="Add admin remarks..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose}
              className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100"
            >
              Close
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-1.5 bg-[#313b91] text-white text-sm rounded hover:bg-[#232a68] disabled:opacity-50"
            >
              {loading ? "Updating..." : "UPDATE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
