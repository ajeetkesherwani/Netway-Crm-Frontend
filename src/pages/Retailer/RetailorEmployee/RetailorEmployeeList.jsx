import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import {
  deleteEmployee,
  getRetailerEmployees,
} from "../../../service/retailerEmployee";
// import { login } from "../../../service/login";
import { useLogin } from "../../../service/login";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-hot-toast";
import ProtectedAction from "../../../components/ProtectedAction";

export default function RetailerEmployeeList() {
  const { login } = useLogin();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const { id: retailerId } = useParams();
  const menuRef = useRef(null);

  console.log(employees, " this is for the employees id");

  // Fetch employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getRetailerEmployees(retailerId);
        setEmployees(data?.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [retailerId]);

  // Close dropdown if clicked outside
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

  // Handlers
  const handleEdit = (empId) => {
    navigate(`/retailer/employee/update/${retailerId}/${empId}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (empId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(retailerId, empId);
        setEmployees(employees.filter((e) => e._id !== empId));
        setOpenMenuId(null);
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Failed to delete employee");
      }
    }
  };
  // this is for the  reseller

  const handleRetailerLogin = async (data) => {
    console.log(data, "this is the data inside the retailer login function");

    const formData = {
      employeeUserName: data.employeeUserName,
      password: data?.plainPassword,
    };

    try {
      const res = await login(formData);

      if (res && res.success) {
        console.log(
          res,
          res?.data?.user?.role?.permissions,
          "This is the response"
        );

        // Store token and permissions
        localStorage.setItem("token", res.token);
        localStorage.setItem("auth", "true");
        localStorage.setItem(
          "rolePermission",
          JSON.stringify(res?.data?.user?.role?.permissions)
        );

        // ✅ Redirect after successful login
        toast.success(`Logged in as ${data.employeeName}`);
        navigate("/");
      } else {
        toast.error(res?.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };
  return (
    <div className="">
      <div className="flex items-center justify-between h-0">
        <div></div>
        <div className="space-x-2 flex">
          <ProtectedAction module="reseller" action="AddEmployee">
            <button
              onClick={() => navigate(`/retailer/employee/create/${retailerId}`)}
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
          {/* Desktop Table View */}
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
                  <ProtectedAction module="reseller" action="employeeLogin">
                    <th className="px-[2px] py-[2px] text-left">Login</th>
                  </ProtectedAction>
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
                      className={`px-[2px] py-[2px] ${employee.status === "active"
                          ? "text-green-700"
                          : "text-red-700"
                        }`}
                    >
                      {employee.status}
                    </td>
                    <td className="px-[2px] py-[2px] text-left">
                      <div className="flex items-center justify-start gap-1">
                        <ProtectedAction module="reseller" action="EditEmployee">
                          <button
                            onClick={() => handleEdit(employee._id)}
                            className="p-1 text-gray-600 hover:text-green-600 rounded"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="reseller" action="DeleteEmployee">
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
                    <ProtectedAction module="reseller" action="EmployeeLogin">
                      <td className="px-[2px] py-[2px]">
                        <button
                          onClick={() => handleRetailerLogin(employee)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Login
                        </button>
                      </td>
                    </ProtectedAction>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
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
                  className={`text-sm ${employee.status === "active"
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
                    onClick={() => handleRetailerLogin(employee)}
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

