import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import.meta.env.VITE_IMAGE_URL
import {
  getAdminTicketDetails,
  // createTicketReply,

  getStaffList,
  getCategoryList,
  updateTicket,
  updateTicketDetails,
  getTicketResolutionOptions,
  getTicketReplyOptions,
  createTicketReply,        
  getTicketReplies,
} from "../../service/ticket";
import { FaUserCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function TicketDetails() {
  const { id: ticketId } = useParams();

  const [ticketDetails, setTicketDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyType, setReplyType] = useState("");
  const [replyOptions, setReplyOptions] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editableDetails, setEditableDetails] = useState({});
  const [files, setFiles] = useState({});
  const [showFixModal, setShowFixModal] = useState(false);
  const [resolutionList, setResolutionList] = useState([]);
  const [selectedResolution, setSelectedResolution] = useState("");
  const [activeTab, setActiveTab] = useState("reply");
  const [loading, setLoading] = useState(false);

  // normalize helper: accept responses that either return { status, data: [...] } or direct arrays/objects
  const normalizeData = (res) => {
    if (!res) return null;
    // res might be array/object directly
    if (Array.isArray(res)) return res;
    // maybe res.data is array/object
    if (res?.data !== undefined) {
      // if data is nested like { data: { data: [...] } } handle both
      if (res.data?.data !== undefined) return res.data.data;
      return res.data;
    }
    // fallback to res itself
    return res;
  };

  // Load everything once ticketId available
  useEffect(() => {
    if (ticketId) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const loadAll = async () => {
    try {
      const [ticketRes, staffRes, catRes, resolutionRes, replyOptRes] =
        await Promise.all([
          getAdminTicketDetails(ticketId),
          getStaffList(),
          getCategoryList(),
          getTicketResolutionOptions(),
          getTicketReplyOptions(),
        ]);

        // console.log("replyOptRes:", replyOptRes);
      // Ticket details (getAdminTicketDetails returns { status, data: { ticket, replies, timeline } })
      if (ticketRes?.status) {
        const ticketData = ticketRes.data.ticket;
        setTicketDetails(ticketData);
        // prefill editable fields - store scalar ids where needed
        setEditableDetails({
          ...ticketData,
          category: ticketData.category?._id || ticketData.category || "",
          assignToId:
            (ticketData.assignToId &&
              (ticketData.assignToId._id || ticketData.assignToId)) ||
            "",
          severity: ticketData.severity || "",
          isChargeable: !!ticketData.isChargeable,
          price: ticketData.price ?? "",
          callDescription: ticketData.callDescription ?? "",
        });
        setReplies(ticketRes.data.replies || []);
        // console.log("Replies timeline data:", ticketRes.data.timeline);
        setTimeline(ticketRes.data.timeline?.[0]?.activities || []);
      } else {
        // fallback: maybe API returned details in another shape
        const maybeTicket = normalizeData(ticketRes);
        if (maybeTicket) {
          setTicketDetails(maybeTicket);
          setEditableDetails({
            ...maybeTicket,
            category: maybeTicket.category?._id || maybeTicket.category || "",
          });
        }
      }

      // staff list: normalize and set - staffRes may return { status, data: [...] }
      const staffData = normalizeData(staffRes);
      // staffData sometimes contains roles list (roleName) or full staff objects
      setStaffList(Array.isArray(staffData) ? staffData : []);

      // categories
      const catData = normalizeData(catRes);
      setCategories(Array.isArray(catData) ? catData : []);

      // resolution options
      const resolutionData = normalizeData(resolutionRes);
      setResolutionList(Array.isArray(resolutionData) ? resolutionData : []);

      // reply options
      const replyData = normalizeData(replyOptRes);
      setReplyOptions(Array.isArray(replyData) ? replyData : []);
    } catch (err) {
      console.error("Error loading ticket details:", err);
      // optional: show an alert or toast
    }
  };

  const handleChange = (field, value) => {
    setEditableDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  // Update ticket (FormData)
  const handleUpdateTicket = async () => {
    // console.log("Updating ticket with details:", editableDetails, files);

    try {
      const formData = new FormData();
      // formData.append("ticketId", "yyuyuyuyuyiu");
      // console.log("Ticket ID appended to FormData:", ticketId);
      // Log editableDetails to ensure it's populated correctly
      // console.log("Editable Details before appending:", editableDetails);

      // Improved: specifically handle known fields to avoid issues
      const fieldsToAppend = [
        "category",
        // "assignToId",
        "severity",
        "callDescription",
        "price",
        "isChargeable",
      ];

      

      // Loop over the fields and append them to formData
      fieldsToAppend.forEach((key) => {
        const value = editableDetails[key];
        // console.log(`Appending ${key}:`, value);  // Log each key and its value
        if (value !== undefined && value !== null) {
          // Convert booleans & numbers to string
          if (typeof value === "boolean" || typeof value === "number") {
            // console.log(`Appending non-string value for ${key}:`, value);
            formData.append(key, String(value));
          } else {
            // console.log(`Appending string value for ${key}:`, value);
            formData.append(key, value);
          }
        }
      });

      formData.append("assignToId", editableDetails.assignToId || "");

      // Append files if any
      for (const key in files) {
        if (files[key]) {
          // console.log(`Appending file ${key}:`, files[key]);  // Log files before appending
          formData.append(key, files[key]);
        }
      }

      // Log the final formData object (it won't show the data directly in console.log)
      // console.log("FormData content:", formData);

      // Now send the data using the API
      const res = await updateTicketDetails(ticketId, formData);
      if (res?.status) {
        alert("✅ Ticket updated successfully!");
        setEditMode(false);
        setFiles({});
        await loadAll();
      } else {
        alert(res?.message || "Failed to update ticket");
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Error updating ticket - see console");
    }
  };



  // Create reply (option or text)
  // ✅ Create reply (select or new text)
  const handleSubmitReply = async () => {
    // console.log("Submitting reply:", { replyText, replyType });
    const message = replyText.trim() || replyType;

    if (!message) {
      alert("Please select a reply or type something!");
      return;
    }

    setLoading(true);
    try {
      // Get userId and ticketId
      const userId = ticketDetails?.userId?._id || ticketDetails?.userId;
      // console.log("Creating reply for ticket:", ticketId, "user:", userId);
      // console.log("Reply message:", message);

      // Call the backend to create the reply
      const result = await createTicketReply(ticketId, userId, message);
      // console.log("Reply creation result:", result);

      if (result?.status) {
        alert("Reply sent successfully!");

        // Clear inputs
        setReplyText("");
        setReplyType("");

        // Try to fetch the replies again
        const repliesData = await getTicketReplies(ticketId);
        // console.log("Fetched replies after submission:", repliesData);
        if (repliesData?.data) {
          setReplies(repliesData.data);
        } else {
          console.error("Failed to fetch replies:", repliesData?.message);
          alert("Error fetching replies after reply submission.");
        }
      } else {
        alert(result?.message || "Failed to send reply");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Error sending reply. Check the console for details.");
    } finally {
      setLoading(false); // Set loading to false after the process ends
    }
  };



  // Fix ticket
  const handleFixTicketClick = () => setShowFixModal(true);
  const closeFixModal = () => setShowFixModal(false);

  const handleFixTicket = async () => {
    if (!selectedResolution) {
      alert("Please select a resolution first");
      return;
    }
    try {
      const res = await updateTicket(ticketId, {
        status: "Fixed",
        resolution: selectedResolution,
      });
      if (res?.status) {
        alert("✅ Ticket marked Fixed!");
        setShowFixModal(false);
        await loadAll();
      } else {
        alert(res?.message || "Failed to mark fixed");
      }
    } catch (err) {
      console.error("Error fixing ticket:", err);
      alert("Error fixing ticket - see console");
    }
  };
  // console.log("replyOptions:", replyOptions);

  if (!ticketDetails)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="flex flex-col bg-[#edf2f7] min-h-screen p-5 gap-5">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[38%] bg-white border shadow-sm rounded-md relative min-h-[85vh]">
          {/* Edit Button */}
          <div className="absolute top-3 right-3 cursor-pointer">
            {editMode ? (
              <FaTimes
                onClick={() => setEditMode(false)}
                className="text-red-600 text-xl hover:text-red-800"
              />
            ) : (
              <FaEdit
                onClick={() => setEditMode(true)}
                className="text-green-600 text-xl animate-pulse hover:text-green-800"
              />
            )}
          </div>

          <div className="border-b bg-[#004c70] text-white px-3 py-2 font-semibold rounded-t-md">
            Ticket Information
          </div>

          <div className="p-4 text-sm text-gray-700 space-y-3">
            {editMode ? (
              <>
                {/* Category */}
                <div>
                  <label className="font-semibold">Category:</label>
                  <select
                    value={editableDetails.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="border w-full rounded-md py-1 px-2 mt-1"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign To (role/staff list) */}
                <div>
                  <label className="font-semibold">Assign To:</label>
                  <select
                    value={editableDetails.assignToId || ""}
                    onChange={(e) => handleChange("assignToId", e.target.value)}
                    className="border w-full rounded-md py-1 px-2 mt-1"
                  >
                    <option value="">Select Staff / Role</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {/* staffList may be roles (roleName) or staff (staffName/name) */}
                        {s.staffName || s.name || s.roleName || s.role}
                        {s.roleName || s.role
                          ? ` (${s.roleName || s.role})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="font-semibold">Severity:</label>
                  <select
                    value={editableDetails.severity || ""}
                    onChange={(e) => handleChange("severity", e.target.value)}
                    className="border w-full rounded-md py-1 px-2 mt-1"
                  >
                    <option value="">Select Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="font-semibold">Description:</label>
                  <textarea
                    rows={3}
                    value={editableDetails.callDescription || ""}
                    onChange={(e) =>
                      handleChange("callDescription", e.target.value)
                    }
                    className="border w-full rounded-md py-1 px-2 mt-1"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="font-semibold">Price:</label>
                  <input
                    type="number"
                    value={editableDetails.price ?? ""}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="border w-full rounded-md py-1 px-2 mt-1"
                  />
                </div>

                {/* Chargeable */}
                <div className="flex items-center gap-2">
                  <label className="font-semibold">Chargeable:</label>
                  <input
                    type="checkbox"
                    checked={!!editableDetails.isChargeable}
                    onChange={(e) =>
                      handleChange("isChargeable", e.target.checked)
                    }
                  />
                </div>

                {/* File uploads */}
                <div>
                  <label className="font-semibold">Upload Files:</label>
                  {["fileI", "fileII", "fileIII"].map((key) => (
                    <div key={key} className="mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, key)}
                        className="border w-full rounded-md py-1 px-2 text-sm"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpdateTicket}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full mt-3 font-semibold shadow"
                >
                  <FaSave className="inline mr-2" /> Save Changes
                </button>
              </>
            ) : (
              <>
                {/* Read-only display */}
                <p>
                  <strong>Ticket No:</strong> #{ticketDetails.ticketNumber}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {ticketDetails.category?.name || "N/A"}
                </p>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {ticketDetails.assignToId?.staffName ||
                    ticketDetails.assignToId?.name ||
                    ticketDetails.assignToId?.roleName ||
                    "Unassigned"}
                </p>
                <p>
                  <strong>Severity:</strong> {ticketDetails.severity || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ₹{ticketDetails.price ?? 0}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs text-white ${
                      ticketDetails.status === "Fixed"
                        ? "bg-green-600"
                        : "bg-orange-500"
                    }`}
                  >
                    {ticketDetails.status}
                  </span>
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {ticketDetails.callDescription ?? "N/A"}
                </p>

                {/* Files preview */}
                <div className="flex gap-3 mt-2">
                  {["fileI", "fileII", "fileIII"].map(
                    (key) =>
                      ticketDetails[key] && (
                        <img
                          key={key}
                          src={`${import.meta.env.VITE_IMAGE_URL}/${ticketDetails[key]}`}
                          alt={key}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      )
                  )}
                </div>
              </>
            )}
          </div>

          {/* Customer Info */}
          <div className="border-t bg-[#004c70] text-white px-3 py-2 font-semibold">
            Customer Information
          </div>
          <div className="p-4 text-sm text-gray-700 space-y-2 pb-16">
            <p>
              <strong>Name:</strong>{" "}
              {ticketDetails.userId?.generalInformation?.name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {ticketDetails.userId?.generalInformation?.email}
            </p>
            <p>
              <strong>Mobile:</strong>{" "}
              {ticketDetails.userId?.generalInformation?.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {ticketDetails.userId?.generalInformation?.address}
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

        {/* RIGHT PANEL */}
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

          {/* Reply Tab */}
          {activeTab === "reply" && (
            <div className="p-4 space-y-4">
              <h2 className="text-md font-semibold text-[#004c70] mb-2">
                Replies for Ticket #{ticketDetails.ticketNumber}
              </h2>
              <select
                value={replyType}
                onChange={(e) => setReplyType(e.target.value)}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm"
              >
                <option value="">Select Reply Type</option>
                {replyOptions.map((r) => (
                  <option
                    key={r._id}
                    value={r.optionText || r.name || r.option}
                  >
                    {r.optionText || r.name || r.option}
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
                onClick={handleSubmitReply}
                disabled={loading}
                className="bg-[#004c70] hover:bg-[#00324d] text-white px-5 py-2 rounded-md font-semibold shadow"
              >
                {loading ? "Submitting..." : "Submit Reply"}
              </button>

              {/* Replies List */}
              <div className="mt-4 border-t pt-2 space-y-3">
                {replies.length === 0 ? (
                  <p className="text-gray-500 text-sm">No replies yet</p>
                ) : (
                  replies.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-start gap-3 bg-gray-50 border rounded-md p-2"
                    >
                      <FaUserCircle className="text-3xl text-gray-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#004c70]">
                          {r.createdById?.name || r.createdBy}
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

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="p-4">
              <h2 className="text-md font-semibold text-[#004c70] mb-2">
                Ticket Timeline
              </h2>
              {timeline.length === 0 ? (
                <p className="text-gray-500 text-sm">No activities found</p>
              ) : (
                timeline.map((a) => (
                  <div
                    key={a._id}
                    className="border-l-4 border-[#004c70] pl-3 pb-2 ml-2 mb-2"
                  >
                    <p className="text-gray-800 text-sm">
                      <strong>Action Type:</strong> {a.activityType == "1"? "Status Change": a.activityType == "0" ? "Assign":"Reassign"} 
                      {/* —{" "} */}
                      {a.performedBy?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fix Modal */}
      {showFixModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Fix This Ticket
            </h3>

            <select
              value={selectedResolution}
              onChange={(e) => setSelectedResolution(e.target.value)}
              className="border border-gray-300 w-full rounded-md py-2 px-3 mb-4 text-sm"
            >
              <option value="">Select Resolution</option>
              {resolutionList.map((r) => (
                <option key={r._id} value={r.name || r.option || r._id}>
                  {r.name || r.option}
                </option>
              ))}
            </select>

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
