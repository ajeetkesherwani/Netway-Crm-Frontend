import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketReplies,
  createTicketReply,
  getTicketTimeline,
  getTicketDetails,
  getStaffRoleList,
  getCategoryList,
} from "../../service/ticket";
import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

export default function TicketDetails() {
  const { id: ticketId } = useParams();

  const [activeTab, setActiveTab] = useState("reply");
  const [replies, setReplies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [selectedType, setSelectedType] = useState("Select");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [staffRoles, setStaffRoles] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableDetails, setEditableDetails] = useState({});
  const [showFixModal, setShowFixModal] = useState(false);

  const replyTypes = [
    "Select",
    "Need Technician Visit",
    "Internet Stable",
    "Power Issue",
    "Fiber Cut",
  ];

  // ✅ Fetch all data on mount
  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
      fetchReplies();
      fetchTimeline();
      fetchStaffRoles();
    }
  }, [ticketId]);

  // ✅ Fetch ticket details
  const fetchTicketDetails = async () => {
    try {
      const res = await getTicketDetails(ticketId);
      if (res?.status) {
        setTicketDetails(res.data);
        setEditableDetails(res.data);
        if (res.data?.assignedTo?._id) {
          setSelectedStaff(res.data.assignedTo._id);
        }
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    }
  };

  // ✅ Fetch replies
  const fetchReplies = async () => {
    try {
      const res = await getTicketReplies(ticketId);
      if (res?.status) setReplies(res.data || []);
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  // ✅ Fetch timeline
  const fetchTimeline = async () => {
    try {
      const res = await getTicketTimeline(ticketId);
      if (res?.status) setTimeline(res.data || []);
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
  };

  // ✅ Fetch staff roles
  const fetchStaffRoles = async () => {
    try {
      const res = await getStaffRoleList();
      if (res?.status) setStaffRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching staff roles:", err);
    }
  };

  // ✅ Fetch category list
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      if (res?.status) setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Handle Assign to Staff
  const handleAssignToStaff = async (staffId) => {
    if (!staffId) return;
    setSelectedStaff(staffId);

    const isReassign = ticketDetails?.assignedTo?._id;
    const endpoint = isReassign
      ? `${BASE_URL}/api/admin/ticketAssign/toStaff/reAssign`
      : `${BASE_URL}/api/admin/ticketAssign/toStaff`;

    const payload = isReassign
      ? { ticketId, assignToId: staffId }
      : { ticketId, staffId };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status) {
        alert(
          isReassign
            ? "✅ Ticket reassigned successfully!"
            : "✅ Ticket assigned successfully!"
        );
        fetchTicketDetails();
      } else alert(data.message || "Failed to assign staff");
    } catch (err) {
      console.error("Error assigning staff:", err);
    }
  };

  // ✅ Toggle edit mode & load categories
  const handleEditToggle = async () => {
    if (!editMode) await fetchCategoryList();
    setEditMode(!editMode);
  };

  // ✅ Save ticket update
  const handleUpdateTicket = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/ticket/update/${ticketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editableDetails),
        }
      );
      const data = await res.json();
      if (data.status) {
        alert("✅ Ticket updated successfully!");
        setEditMode(false);
        fetchTicketDetails();
      } else alert(data.message || "Failed to update ticket");
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  // ✅ Submit reply
  const handleSubmit = async () => {
    if (!selectedType || selectedType === "Select") {
      alert("Please select a reply type");
      return;
    }
    setLoading(true);
    try {
      const res = await createTicketReply(ticketId, {
        replyType: selectedType,
        description: replyText || selectedType,
      });
      if (res?.status) {
        alert("Reply submitted successfully!");
        setReplyText("");
        setSelectedType("Select");
        fetchReplies();
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFixTicketClick = () => setShowFixModal(true);
  const closeFixModal = () => setShowFixModal(false);

  const handleFixTicket = async () => {
    try {
      alert("✅ Ticket marked as Fixed!");
      setShowFixModal(false);
      fetchTicketDetails();
    } catch (err) {
      console.error("Error fixing ticket:", err);
    }
  };

  if (!ticketDetails)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="flex flex-col bg-[#edf2f7] min-h-screen p-5 gap-5">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[38%] bg-white border shadow-sm rounded-md relative min-h-[85vh]">
          <div className="absolute top-3 right-3 text-gray-600 hover:text-teal-700 cursor-pointer">
            {editMode ? (
              <FaTimes onClick={handleEditToggle} />
            ) : (
              <FaEdit onClick={handleEditToggle} />
            )}
          </div>

          <div className="border-b bg-[#004c70] text-white px-3 py-2 font-semibold rounded-t-md">
            Ticket Information
          </div>

          <div className="p-4 text-sm text-gray-700 space-y-2">
            {editMode ? (
              <>
                <div>
                  <label className="font-semibold">Category:</label>
                  <select
                    value={editableDetails.categoryName || ""}
                    onChange={(e) =>
                      setEditableDetails({
                        ...editableDetails,
                        categoryName: e.target.value,
                      })
                    }
                    className="border border-gray-300 w-full rounded-md py-1 px-2 mt-1 text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold">Severity:</label>
                  <select
                    value={editableDetails.severity || ""}
                    onChange={(e) =>
                      setEditableDetails({
                        ...editableDetails,
                        severity: e.target.value,
                      })
                    }
                    className="border border-gray-300 w-full rounded-md py-1 px-2 mt-1 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold">Description:</label>
                  <textarea
                    value={editableDetails.description || ""}
                    onChange={(e) =>
                      setEditableDetails({
                        ...editableDetails,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="border border-gray-300 w-full rounded-md py-1 px-2 mt-1 text-sm"
                  />
                </div>

                <button
                  onClick={handleUpdateTicket}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full mt-3"
                >
                  <FaSave className="inline mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {ticketDetails.categoryName || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {ticketDetails.description || "No description available"}
                </p>
                <p>
                  <strong>Call Source:</strong>{" "}
                  {ticketDetails.callSource || "N/A"}
                </p>
                <p>
                  <strong>Severity:</strong> {ticketDetails.severity || "N/A"}
                </p>
                <p>
                  <strong>Created By:</strong>{" "}
                  {ticketDetails.createdByName || "N/A"}
                </p>
                <p>
                  <strong>Create At:</strong>{" "}
                  {new Date(ticketDetails.createdAt).toLocaleString()}
                </p>
              </>
            )}

            <div>
              <strong>Assign To:</strong>
              <select
                value={selectedStaff}
                onChange={(e) => handleAssignToStaff(e.target.value)}
                className="border border-gray-300 w-full mt-1 rounded-md py-1 px-2 text-sm"
              >
                <option value="">Select Staff</option>
                {staffRoles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs text-white ${
                  ticketDetails.status === "Fixed"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
              >
                {ticketDetails.status}
              </span>
            </p>
          </div>

          <div className="border-t bg-[#004c70] text-white px-3 py-2 font-semibold">
            Customer Information
          </div>

          <div className="p-4 text-sm text-gray-700 space-y-2 pb-16">
            <p>
              <strong>Name:</strong> {ticketDetails.personName}
            </p>
            <p>
              <strong>Email:</strong> {ticketDetails.email}
            </p>
            <p>
              <strong>Mobile:</strong> {ticketDetails.personNumber}
            </p>
            <p>
              <strong>Address:</strong> {ticketDetails.address}
            </p>
          </div>

          {ticketDetails.status !== "Fixed" && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-center">
              <button
                onClick={handleFixTicketClick}
                className="bg-[#004c70] hover:bg-[#00324d] text-white px-6 py-2 rounded-md font-semibold shadow"
              >
                Fix the Ticket
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL (Reply + Timeline) */}
        <div className="w-full lg:w-[62%] bg-white border shadow-sm rounded-md">
          <div className="flex border-b text-sm">
            <button
              className={`flex-1 py-2 font-semibold ${
                activeTab === "reply"
                  ? "border-b-2 border-[#004c70] text-[#004c70]"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reply")}
            >
              Reply
            </button>
            <button
              className={`flex-1 py-2 font-semibold ${
                activeTab === "timeline"
                  ? "border-b-2 border-[#004c70] text-[#004c70]"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
          </div>

          {activeTab === "reply" && (
            <div className="p-4 space-y-4 min-h-[250px]">
              <h2 className="text-md font-semibold text-[#004c70] mb-2">
                Reply Of Ticket No. {ticketDetails.ticketNumber}
              </h2>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
              >
                {replyTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder="Type your reply here..."
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#004c70] hover:bg-[#00324d] text-white px-5 py-2 rounded-md"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <div className="mt-4 border-t pt-2 space-y-3">
                {replies.length === 0 ? (
                  <p className="text-gray-500 text-sm">No replies yet</p>
                ) : (
                  replies.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-gray-50 border rounded-md p-2"
                    >
                      <FaUserCircle className="text-3xl text-gray-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#004c70]">
                          {r.createdByName || "Unknown User"}
                        </p>
                        <p className="text-gray-700 text-sm">{r.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="p-4 min-h-[250px]">
              <h2 className="text-md font-semibold text-[#004c70] mb-2">
                Ticket History
              </h2>
              <div className="space-y-4">
                {timeline.length === 0 ? (
                  <p className="text-gray-500 text-sm">No timeline found</p>
                ) : (
                  timeline.map((t, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-[#004c70] pl-3 pb-2 ml-2"
                    >
                      <p className="text-gray-800 text-sm">
                        <strong>{t.actionType}</strong> — {t.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Fix Ticket Modal */}
      {showFixModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Fix This Ticket
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This popup will later show your Fix Ticket API content.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeFixModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleFixTicket}
                className="px-4 py-2 bg-[#004c70] text-white rounded hover:bg-[#00324d]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
