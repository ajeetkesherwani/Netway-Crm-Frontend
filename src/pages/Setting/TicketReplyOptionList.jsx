// import React, { useEffect, useState } from "react";
// import {
//   getTicketReplyOptions,
//   updateTicketReplyOption,
//   deleteTicketReplyOption,
// } from "../../service/ticketReplyOption";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function TicketReplyOptionList() {
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // confirm modal
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmOption, setConfirmOption] = useState(null);

//   // update modal
//   const [updateOpen, setUpdateOpen] = useState(false);
//   const [updateData, setUpdateData] = useState(null);
//   const [updateText, setUpdateText] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const fetchOptions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getTicketReplyOptions();
//       if (res.status) setOptions(res.data || []);
//       else setError(res.message || "Failed to load options");
//     } catch (err) {
//       setError(err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOptions();
//   }, []);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const handleUpdate = (id, currentText) => {
//     setUpdateData({ id, currentText });
//     setUpdateText(currentText || "");
//     setUpdateOpen(true);
//   };

//   const confirmUpdate = async () => {
//     if (!updateData) return;
//     const text = (updateText || "").trim();
//     if (!text) {
//       setError("Option text is required");
//       return;
//     }
//     setUpdateLoading(true);
//     try {
//       const res = await updateTicketReplyOption(updateData.id, {
//         optionText: text,
//       });
//       if (res && (res.status === true || res.success)) {
//         await fetchOptions();
//       } else if (res && res.message) {
//         setError(res.message);
//       } else {
//         setError("Failed to update option");
//       }
//     } catch (err) {
//       setError(err?.message || "Network error");
//     } finally {
//       setUpdateLoading(false);
//       setUpdateOpen(false);
//       setUpdateData(null);
//       setUpdateText("");
//     }
//   };

//   const cancelUpdate = () => {
//     setUpdateOpen(false);
//     setUpdateData(null);
//     setUpdateText("");
//   };

//   const handleDelete = (id, optionText) => {
//     setConfirmOption({ id, optionText });
//     setConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!confirmOption) return;
//     const { id } = confirmOption;
//     try {
//       const res = await deleteTicketReplyOption(id);
//       if (res && (res.status === true || res.success)) {
//         await fetchOptions();
//       } else if (res && res.message) {
//         setError(res.message);
//       } else {
//         setError("Failed to delete option");
//       }
//     } catch (err) {
//       setError(err?.message || "Network error");
//     } finally {
//       setConfirmOpen(false);
//       setConfirmOption(null);
//     }
//   };

//   const cancelDelete = () => {
//     setConfirmOpen(false);
//     setConfirmOption(null);
//   };

//   if (loading) return <p className="p-4">Loading options...</p>;

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">Ticket Reply Option List</h1>
//         <button
//           onClick={() => navigate("/setting/ticketReplyOption/create")}
//           className="px-[2px] py-[2px] text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Add Option
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
//           <span>{error}</span>
//           <button
//             onClick={() => setError(null)}
//             className="float-right font-bold"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {options.length === 0 ? (
//         <p className="text-gray-500">No ticket reply options found.</p>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-[600px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-[2px] py-[0px] text-left">S.No</th>
//                   <th className="px-[2px] py-[0px] text-left">Option Text</th>
//                   <th className="px-[2px] py-[0px] text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {options.map((opt, index) => (
//                   <tr key={opt._id} className="hover:bg-gray-50">
//                     <td className="px-[2px] py-[0px]">{index + 1}</td>
//                     <td className="px-[2px] py-[0px]">{opt.optionText}</td>
//                     <td className="px-[2px] py-[0px] text-left">
//                       <div className="flex items-center gap-1">
//                         <button
//                           onClick={() => handleUpdate(opt._id, opt.optionText)}
//                           className="p-1 text-gray-600 hover:text-green-600 rounded"
//                           title="Update"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(opt._id, opt.optionText)}
//                           className="p-1 text-red-600 hover:text-red-700 rounded"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="space-y-4 md:hidden">
//             {options.map((opt, index) => (
//               <div
//                 key={opt._id}
//                 className="p-4 border rounded-lg shadow-sm bg-white"
//               >
//                 <p className="text-sm text-gray-500">{index + 1}</p>
//                 <h2 className="text-lg font-medium">{opt.optionText}</h2>
//                 <div className="flex justify-end space-x-3 mt-3">
//                   <button
//                     onClick={() => handleUpdate(opt._id, opt.optionText)}
//                     className="text-green-600 flex items-center text-sm"
//                   >
//                     <FaEdit className="mr-1" /> Update
//                   </button>
//                   <button
//                     onClick={() => handleDelete(opt._id, opt.optionText)}
//                     className="text-red-600 flex items-center text-sm"
//                   >
//                     <FaTrash className="mr-1" /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Delete Modal */}
//       {confirmOpen && confirmOption && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={cancelDelete}
//           />
//           <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
//             <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
//             <p className="mb-4">
//               Are you sure you want to delete "
//               <strong>{confirmOption.optionText}</strong>"?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={cancelDelete}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Modal */}
//       {updateOpen && updateData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={cancelUpdate}
//           />
//           <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
//             <h3 className="text-lg font-semibold mb-3">Update Reply Option</h3>
//             <label className="block text-sm mb-2">Option Text</label>
//             <input
//               value={updateText}
//               onChange={(e) => setUpdateText(e.target.value)}
//               className="w-full border p-2 rounded mb-4"
//               placeholder="Enter reply option text"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={cancelUpdate}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                 disabled={updateLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmUpdate}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 disabled={updateLoading}
//               >
//                 {updateLoading ? "Updating..." : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  getTicketReplyOptions,
  deleteTicketReplyOption,
} from "../../service/ticketReplyOption";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TicketReplyOptionList() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Confirm delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOption, setConfirmOption] = useState(null);

  // ✅ Fetch all options
  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTicketReplyOptions();
      if (res.status) setOptions(res.data || []);
      else setError(res.message || "Failed to load options");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ✅ Handle delete
  const handleDelete = (id, optionText) => {
    setConfirmOption({ id, optionText });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmOption) return;
    const { id } = confirmOption;
    try {
      const res = await deleteTicketReplyOption(id);
      if (res && (res.status === true || res.success)) {
        await fetchOptions();
      } else if (res && res.message) {
        setError(res.message);
      } else {
        setError("Failed to delete option");
      }
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setConfirmOpen(false);
      setConfirmOption(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmOption(null);
  };

  if (loading) return <p className="p-4">Loading options...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Ticket Reply Option List</h1>
        <button
          onClick={() => navigate("/setting/ticketReplyOption/create")}
          className="px-[8px] py-[6px] text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Option
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Empty State */}
      {options.length === 0 ? (
        <p className="text-gray-500">No ticket reply options found.</p>
      ) : (
        <>
          {/* ✅ Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[600px] w-full border border-gray-200 divide-y divide-gray-200 text-[14px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-[2px] py-[6px] text-left">S.No</th>
                  <th className="px-[2px] py-[6px] text-left">Option Text</th>
                  <th className="px-[2px] py-[6px] text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {options.map((opt, index) => (
                  <tr key={opt._id} className="hover:bg-gray-50">
                    <td className="px-[2px] py-[6px]">{index + 1}</td>
                    <td className="px-[2px] py-[6px]">{opt.optionText}</td>
                    <td className="px-[2px] py-[6px] text-left">
                      <div className="flex items-center gap-2">
                        {/* ✅ Navigate to update page */}
                        <button
                          onClick={() =>
                            navigate(
                              `/setting/ticketReplyOption/update/${opt._id}`
                            )
                          }
                          className="p-1 text-gray-600 hover:text-green-600 rounded"
                          title="Update"
                        >
                          <FaEdit />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(opt._id, opt.optionText)}
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

          {/* ✅ Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {options.map((opt, index) => (
              <div
                key={opt._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h2 className="text-lg font-medium">{opt.optionText}</h2>

                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={() =>
                      navigate(`/setting/ticketReplyOption/update/${opt._id}`)
                    }
                    className="text-green-600 flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(opt._id, opt.optionText)}
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

      {/* ✅ Delete Confirmation Modal */}
      {confirmOpen && confirmOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDelete}
          />
          <div className="bg-white rounded-lg shadow-lg z-60 max-w-sm w-full p-5">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete "
              <strong>{confirmOption.optionText}</strong>"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
