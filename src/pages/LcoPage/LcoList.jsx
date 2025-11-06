import { useEffect, useState, useRef } from "react";
import { deleteLco, getAllLco } from "../../service/lco";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet, MdOutlineAssignment } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import ProtectedAction from "../../components/ProtectedAction";

export default function LcoList() {
  const [lco, setLco] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // fetch lco
  useEffect(() => {
    const loadLco = async () => {
      try {
        const res = await getAllLco();
        setLco(res.data || []);
      } catch (err) {
        console.error("Error fetching LCO:", err);
        setError("Failed to load LCO list");
      } finally {
        setLoading(false);
      }
    };
    loadLco();
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
    navigate(`/lco/list/${id}`);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/lco/update/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this LCO?")) {
      try {
        await deleteLco(id)
        setLco(lco.filter((l) => l._id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error("Error deleting retailer:", err);
        setError("Failed to delete retailer");
      }
    }
  };
  // asssign package to the retailer
  const handleAssignPackage = (id) => {
    navigate(`/lco/assignPackage/list/${id}`)
  }
  // this is for handle the wallet of the retailer
  const handleWallet = (id) => {
    navigate(`/lco/wallet/list/${id}`)
  }
  const handleEmployee = (id) => {
    navigate(`/lco/employee/list/${id}`)
  }
  if (loading) return <p className="p-4">Loading LCOs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Lco List</h1>
        <ProtectedAction module="lco" action="create">
          <button
            onClick={() => navigate("/lco/create")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Add Lco"
          >
            Add Lco
          </button>
        </ProtectedAction>
      </div>
      {lco.length === 0 ? (
        <p className="text-gray-500">No LCOs found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-200 divide-y divide-gray-200 text-[12px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[2px] text-left">S.No</th>
                  <th className="px-[2px] py-[2px] text-left">LCO Name</th>
                  <th className="px-[2px] py-[2px] text-left">Mobile No</th>
                  <th className="px-[2px] py-[2px] text-left">State</th>
                  <th className="px-[2px] py-[2px] text-left">Email</th>
                  <th className="px-[2px] py-[2px] text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lco.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 relative">
                    <td className="px-[2px] py-[2px]">{index + 1}</td>
                    <td className="px-[2px] py-[2px] hover:cursor-pointer hover:underline" onClick={() => handleView(item._id)}>{item.lcoName}</td>
                    <td className="px-[2px] py-[2px]">{item.mobileNo}</td>
                    <td className="px-[2px] py-[2px]">{item.state}</td>
                    <td className="px-[2px] py-[2px]">{item.email || "—"}</td>
                    {/* <td className="px-[2px] py-[2px] text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === item._id ? null : item._id)
                        }
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === item._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-30"
                        >
                            <button
                            onClick={() => handleEmployee(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAccountBalanceWallet size={20} className="mr-2" /> Employee
                          </button>
                          <button
                            onClick={() => handleWallet(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAccountBalanceWallet size={20} className="mr-2" />Wallet
                          </button>
                          <button
                            onClick={() => handleAssignPackage(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <MdOutlineAssignment size={20} className="mr-2" /><marquee behavior="scroll" direction="" scrollAmount="5"> Assign Package</marquee>
                          </button>
                          <button
                            onClick={() => handleView(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <FaEye className="mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm hover:bg-gray-100"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center w-full px-3 py-[2px] text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td> */}
                    <td className="px-[2px] py-[2px] text-right relative">
                      <div className="flex justify-start space-x-3">
                        {/* <button
                          onClick={() => handleEmployee(item._id)}
                          className="p-1 hover:bg-gray-100 focus:outline-none"
                          title="Employee"
                        >
                          <MdOutlineSupportAgent  size={20} />
                        </button>
                        <button
                          onClick={() => handleWallet(item._id)}
                          className="p-1 hover:bg-gray-100 focus:outline-none"
                          title="Wallet"
                        >
                          <MdOutlineAccountBalanceWallet size={20} />
                        </button>
                        <button
                          onClick={() => handleAssignPackage(item._id)}
                          className="p-1 hover:bg-gray-100 focus:outline-none"
                          title="Assign Package"
                        >
                          <MdOutlineAssignment size={20} />
                        </button> */}
                     <ProtectedAction module="lco" action="view">
                          <button
                            onClick={() => handleView(item._id)}
                            className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="lco" action="edit">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction module="lco" action="delete">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </ProtectedAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
             {lco.map((item, index) => (
               <div
                 key={item._id}
                 className="p-4 border rounded-lg shadow-sm bg-white"
               >
                 <p className="text-sm text-gray-500">#{index + 1}</p>
                 <h2 className="text-lg font-medium hover:cursor-pointer hover:underline" onClick={() => handleView(item._id)}>{item.lcoName}</h2>
                 <p className="text-sm">{item.mobileNo}</p>
                 <p className="text-sm">{item.state}</p>
                 <p className="text-sm">{item.email || "—"}</p>
                 <div className="flex justify-end space-x-3 mt-3">
                   <button
                     onClick={() => handleEmployee(retailer._id)}
                     className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                     title="Employee"
                   >
                     <MdOutlineAccountBalanceWallet size={20} />
                   </button>
                  <ProtectedAction module="lco" action="view">
                    <button
                      onClick={() => handleView(item._id)}
                      className="p-1 text-blue-600 hover:bg-gray-100 focus:outline-none"
                      title="View"
                    >
                      <FaEye size={16} />
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="lco" action="edit">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="p-1 text-green-600 hover:bg-gray-100 focus:outline-none"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                  </ProtectedAction>
                  <ProtectedAction module="lco" action="delete">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-red-600 hover:bg-gray-100 focus:outline-none"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </ProtectedAction>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
