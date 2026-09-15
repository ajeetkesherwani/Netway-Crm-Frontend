import React, { useState, useEffect } from "react";
import { getStaff } from "../../service/staffService";
import { getMonthlyReport } from "../../service/attendance";
import AttendanceModal from "./AttendanceModal";
import { usePermission } from "../../context/PermissionContext";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

export default function AttendanceList() {
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // staffId -> array of attendance objects
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { permissions } = usePermission();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // { staff, date, attendance }

  // Calendar logic
  const today = new Date();
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // 1. Fetch Staff
      const staffRes = await getStaff();
      const staffs = staffRes.data || [];
      setStaffList(staffs);

      // 2. Fetch Report for each staff
      const promises = staffs.map((staff) =>
        getMonthlyReport(selectedMonth, selectedYear, staff._id)
          .then((res) => ({ staffId: staff._id, data: res.data || [] }))
          .catch((err) => ({ staffId: staff._id, data: [] }))
      );

      const reports = await Promise.all(promises);
      const dataMap = {};
      reports.forEach((r) => {
        dataMap[r.staffId] = r.data;
      });
      setAttendanceData(dataMap);
    } catch (err) {
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const handleCellClick = (staff, date, attendanceRecord) => {
    setModalData({
      staff,
      date,
      attendance: attendanceRecord,
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600";
      case "Absent":
        return "text-red-600";
      case "Half Day":
        return "text-orange-500";
      case "Leave":
        return "text-blue-500";
      case "Holiday":
        return "text-gray-500";
      default:
        return "text-red-600";
    }
  };

  const getStatusInitial = (status) => {
    switch (status) {
      case "Present": return "P";
      case "Absent": return "A";
      case "Half Day": return "H";
      case "Leave": return "L";
      case "Holiday": return "HO";
      default: return "A";
    }
  };

  const exportExcel = () => {
    if (staffList.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = staffList.map((staff, idx) => {
      const row = {
        "S.No": idx + 1,
        "Employee": staff.name,
        "User ID": staff.logId,
      };

      const staffAttendance = attendanceData[staff._id] || [];
      daysArray.forEach((day, index) => {
        const att = staffAttendance[index];
        row[`${day} ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'short' })}`] = att ? getStatusInitial(att.status) : "A";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance_${selectedMonth}_${selectedYear}`);
    XLSX.writeFile(workbook, `Attendance_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 h-[38px] text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 h-[38px] text-sm"
            >
              {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center h-[38px]">
            <span className="px-3 bg-green-600 text-white text-xs font-semibold rounded shadow flex items-center h-full">P Present</span>
            <span className="px-3 bg-red-600 text-white text-xs font-semibold rounded shadow flex items-center h-full">A ABSENT</span>
            <span className="px-3 bg-[#232a68] text-white text-xs font-semibold rounded shadow flex items-center h-full">H Half Day</span>
          </div>
          {permissions?.attendance?.Export && (
            <button
              onClick={exportExcel}
              className="px-4 bg-[#232a68] text-white rounded font-semibold text-sm hover:bg-opacity-90 flex items-center gap-2 h-[38px]"
            >
              <FaFileExcel /> EXPORT
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border rounded shadow flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-10 text-center text-gray-500 flex-1">Loading attendance...</div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-center border-collapse min-w-max">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-1 px-2 border-r border-b w-8 sticky left-0 z-10 bg-gray-100 shadow-[1px_0_0_0_#e5e7eb]">#</th>
                  <th className="py-1 px-2 border-r border-b text-left sticky left-8 z-10 bg-gray-100 shadow-[1px_0_0_0_#e5e7eb] min-w-[120px]">Employee</th>
                  {daysArray.map((day) => (
                    <th key={day} className="py-1 px-1 border-r border-b font-medium text-[10px] leading-tight">
                      {day} <br /> {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'short' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, idx) => {
                  const staffAttendance = attendanceData[staff._id] || [];
                  return (
                    <tr key={staff._id} className="border-b hover:bg-gray-50 text-xs">
                      <td className="py-1 px-2 border-r sticky left-0 bg-white font-medium">{idx + 1}</td>
                      <td className="py-1 px-2 border-r text-left sticky left-8 bg-white text-blue-800 font-bold uppercase min-w-[120px] shadow-[1px_0_0_0_#e5e7eb] truncate max-w-[150px]">
                        {staff.name}
                      </td>
                      {daysArray.map((day, index) => {
                        const attDate = new Date(selectedYear, selectedMonth - 1, day);
                        // Reset time for strict date comparison
                        const todayReset = new Date();
                        todayReset.setHours(0, 0, 0, 0);
                        const isFuture = attDate > todayReset;

                        if (isFuture) {
                          return <td key={day} className="py-1 px-1 border-r bg-white"></td>;
                        }

                        const att = staffAttendance[index] || {
                          date: attDate.toISOString(),
                          status: "Absent"
                        };
                        return (
                          <td
                            key={day}
                            className={`py-1 px-1 border-r ${permissions?.attendance?.MarkAttendance ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default'} transition font-bold ${getStatusColor(att.status)}`}
                            onClick={() => permissions?.attendance?.MarkAttendance && handleCellClick(staff, att.date, att)}
                            title={`${att.status} - ${staff.name}`}
                          >
                            {getStatusInitial(att.status)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {permissions?.attendance?.MarkAttendance && (
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={modalData}
          onUpdate={fetchAttendance}
        />
      )}
    </div>
  );
}
