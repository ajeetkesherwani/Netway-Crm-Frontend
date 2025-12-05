import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import {
  deleteLcoEmployee,
  getLcoEmployees,
} from "../../../service/lcoEmployee";
// import { login } from "../../../service/login";
import { useLogin } from "../../../service/login";
import { toast } from "react-hot-toast";
import ProtectedAction from "../../../components/ProtectedAction";

export default function LcoEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const { id: lcoId } = useParams();
  const menuRef = useRef(null);

  // ✅ Fetch employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getLcoEmployees(lcoId);
        setEmployees(data?.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [lcoId]);

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Edit Employee
  const handleEdit = (empId) => {
    navigate(`/lco/employee/update/${lcoId}/${empId}`);
    setOpenMenuId(null);
  };

  // ✅ Delete Employee
  const handleDelete = async (empId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteLcoEmployee(lcoId, empId);
        setEmployees(employees.filter((e) => e._id !== empId));
        toast.success("Employee deleted successfully");
      } catch (err) {
        console.error("Error deleting employee:", err);
        toast.error("Failed to delete employee");
      }
    }
  };

  // ✅ LCO Employee Login
  const handleLcoLogin = async (data) => {
    console.log(data, "🔹 LCO employee data for login");

    const formData = {
      employeeUserName: data.employeeUserName,
      password: data?.plainPassword,
    };

    try {
      const res = await login(formData);

      if (res && res.success) {
        console.log(res, "✅ LCO login response");

        // ✅ Store token and permissions
        localStorage.setItem("token", res.token);
        localStorage.setItem("auth", "true");
        localStorage.setItem(
          "rolePermission",
          JSON.stringify(res?.data?.user?.role?.permissions || [])
        );

        toast.success(`Logged in as ${data.employeeName}`);
        navigate("/"); // ✅ Redirect to dashboard
      } else {
        toast.error(res?.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  if (loading) return <p className="p-4">Loading employees...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="">
      <div className="flex items-center justify-between h-0">
        <div></div>
        <div className="space-x-2 flex">
          <ProtectedAction module="lco" action="addEmployee">
          <button
            onClick={() => navigate(`/lco/employee/create/${lcoId}`)}
            className="px-1 py-[1px] text-white bg-blue-600 rounded hover:bg-blue-700 relative -top-3 right-6 text-[12px]"
          >
            Add Employee
          </button>
          </ProtectedAction>
        </div>
      </div>

      {employees.length < 1 ? (
        <p className="text-gray-500 text-center">No employees found.</p>
      ) : (
        <>
          {/* ✅ Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[13px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">Employee Name</th>
                  <th className="px-[2px] py-[2px] text-left">Username</th>
                  <th className="px-[2px] py-[2px] text-left">Type</th>
                  <th className="px-[2px] py-[2px] text-left">Mobile</th>
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Status</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                  <th className="px-[2px] py-[2px] text-left">Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px]">
                      {employee.employeeName}
                    </td>
                    <td className="px-[2px] py-[2px]">
                      {employee.employeeUserName}
                    </td>
                    <td className="px-[2px] py-[2px]">{employee.type}</td>
                    <td className="px-[2px] py-[2px]">{employee.mobile}</td>
                    <td className="px-[2px] py-[2px]">
                      {employee.email || "—"}
                    </td>
                    <td
                      className={`px-[2px] py-[2px] ${
                        employee.status === "active"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {employee.status}
                    </td>

                    {/* ✅ Action buttons */}
                    <td className="px-[2px] py-[2px] text-left">
                      <div className="flex items-center justify-start gap-1">
                        <ProtectedAction module="lco" action="editEmployee">
                          <button
                            onClick={() => handleEdit(employee._id)}
                            className="p-1 text-gray-600 hover:text-green-600 rounded"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="lco" action="deleteEmployee">
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="p-1 text-red-600 hover:text-red-700 rounded"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        </ProtectedAction>
                      </div>
                    </td>

                    {/* ✅ Login button */}
                    <td className="px-[2px] py-[2px]">
                      <ProtectedAction module="lco" action="employeeLogin">
                      <button
                        onClick={() => handleLcoLogin(employee)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Login
                      </button>
                      </ProtectedAction>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {employees.map((employee, index) => (
              <div
                key={employee._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">{index + 1}</p>
                <h2 className="text-lg font-medium">{employee.employeeName}</h2>
                <p className="text-sm">{employee.employeeUserName}</p>
                <p className="text-sm">{employee.type}</p>
                <p className="text-sm">{employee.mobile}</p>
                <p className="text-sm">{employee.email || "—"}</p>
                <p
                  className={`text-sm ${
                    employee.status === "active"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {employee.status}
                </p>

                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() => handleEdit(employee._id)}
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="text-red-600 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                  <button
                    onClick={() => handleLcoLogin(employee)}
                    className="text-blue-600 flex items-center text-sm"
                  >
                    Login
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
