import { useEffect, useState, useRef } from "react";
import { deleteRetailer, getRetailer } from "../../service/retailer";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineAssignment,
  MdOutlineSupportAgent,
} from "react-icons/md";
import LcoList from "../LcoPage/LcoList";

export default function RetailerList() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // fetch retailers
  useEffect(() => {
    const loadRetailers = async () => {
      try {
        const res = await getRetailer();
        setRetailers(res.data || []);
      } catch (err) {
        console.error("Error fetching retailers:", err);
        setError("Failed to load retailers");
      } finally {
        setLoading(false);
      }
    };
    loadRetailers();
  }, []);

  // close dropdown if clicked outside
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
  const handleView = (id) => {
    navigate(`/retailer/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/retailer/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this retailer?")) {
      // TODO: Call delete API here
      try {
        await deleteRetailer(id);
        setRetailers(retailers.filter((r) => r._id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error("Error deleting retailer:", err);
        setError("Failed to delete retailer");
      }
    }
  };
  // asssign package to the retailer
  const handleAssignPackage = (id) => {
    navigate(`/retailer/assignPackage/list/${id}`);
  };
  // this is for handle the wallet of the retailer
  const handleWallet = (id) => {
    navigate(`/retailer/wallet/list/${id}`);
  };
  const handleEmployee = (id) => {
    navigate(`/retailer/employee/list/${id}`);
  };
  if (loading) return <p className="p-4">Loading retailers...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Reseller List</h1>
          <button
            onClick={() => navigate("/retailer/create")}
            className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Reseller
          </button>
        </div>
        {retailers.length === 0 ? (
          <p className="text-gray-500">No retailers found.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-[2px] py-[0px] text-left">S.No</th>
                    <th className="px-[2px] py-[0px] text-left ">
                      Reseller Name
                    </th>
                    <th className="px-[2px] py-[0px] text-left">Mobile No</th>
                    <th className="px-[2px] py-[0px] text-left">State</th>
                    <th className="px-[2px] py-[0px] text-left">Email</th>
                    <th className="px-[2px] py-[0px] text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {retailers.map((retailer, index) => (
                    <tr
                      key={retailer._id}
                      className="hover:bg-gray-50 relative"
                    >
                      <td className="px-[2px] py-[0px]">{index + 1}</td>
                      <td
                        className="px-[2px] py-[0px] hover:cursor-pointer hover:underline"
                        onClick={() => handleView(retailer._id)}
                      >
                        {retailer.resellerName}
                      </td>
                      <td className="px-[2px] py-[0px]">{retailer.mobileNo}</td>
                      <td className="px-[2px] py-[0px]">{retailer.state}</td>
                      <td className="px-[2px] py-[0px]">
                        {retailer.email || "—"}
                      </td>
                      {/* <td className="px-[2px] py-[0px] text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === retailer._id ? null : retailer._id
                          )
                        }
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === retailer._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
                        >
                          <button
                            onClick={() => handleEmployee(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAccountBalanceWallet size={20} className="mr-2" /> Employee
                          </button>
                          <button
                            onClick={() => handleWallet(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAccountBalanceWallet size={20} className="mr-2" />Wallet
                          </button>
                          <button
                            onClick={() => handleAssignPackage(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAssignment size={20} className="mr-2" /><marquee behavior="scroll" direction="" scrollAmount="5">Assign Package</marquee>
                          </button>
                          <button
                            onClick={() => handleView(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <FaEye className="mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(retailer._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td> */}
                      <td className="px-[2px] py-[0px] text-left relative">
                        <div className="flex items-center  gap-1">
                          {/* <button
                          onClick={() => handleEmployee(retailer._id)}
                          className="p-1 text-gray-600 hover:text-blue-600 rounded"
                          title="Employee"
                        >
                          <MdOutlineSupportAgent size={20} />
                        </button> */}
                          {/* <button
                          onClick={() => handleWallet(retailer._id)}
                          className="p-1 text-gray-600 hover:text-blue-600 rounded"
                          title="Wallet"
                        >
                          <MdOutlineAccountBalanceWallet size={20} />
                        </button> */}
                          {/* <button
                          onClick={() => handleAssignPackage(retailer._id)}
                          className="p-1 text-gray-600 hover:text-green-600 rounded"
                          title="Assign Package"
                        >
                          <MdOutlineAssignment size={20} />
                        </button> */}
                          <button
                            onClick={() => handleView(retailer._id)}
                            className="p-1 text-gray-600 hover:text-blue-600 rounded"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(retailer._id)}
                            className="p-1 text-gray-600 hover:text-green-600 rounded"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(retailer._id)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
              {retailers.map((retailer, index) => (
                <div
                  key={retailer._id}
                  className="p-4 border rounded-lg shadow-sm bg-white"
                >
                  <p className="text-sm text-gray-500">{index + 1}</p>
                  <h2 className="text-lg font-medium">
                    {retailer.resellerName}
                  </h2>
                  <p className="text-sm">{retailer.mobileNo}</p>
                  <p className="text-sm">{retailer.state}</p>
                  <p className="text-sm">{retailer.email || "—"}</p>
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => handleView(retailer._id)}
                      className="text-blue-600 flex items-center text-sm"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                    <button
                      onClick={() => handleEdit(retailer._id)}
                      className="text-green-600 flex items-center text-sm"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(retailer._id)}
                      className="text-red-600 flex items-center text-sm"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* <div>
      <LcoList/>
    </div> */}
    </>
  );
}
