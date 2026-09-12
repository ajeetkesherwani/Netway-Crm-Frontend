import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { getRoles } from "../../service/role";
import { getStaffDetails, getAllZoneList } from "../../service/staffService";
import { toast } from "react-toastify";

export default function StaffView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch staff details, roles and zones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, rolesRes, zonesRes] = await Promise.allSettled([
          getStaffDetails(id),
          getRoles(),
          getAllZoneList(),
        ]);

        if (staffRes.status === "fulfilled" && staffRes.value?.data) {
          setStaff(staffRes.value.data);
        } else {
          setError("Failed to load staff details");
          toast.error("Failed to load staff details ❌");
        }

        if (rolesRes.status === "fulfilled" && rolesRes.value?.data) {
          setRoles(rolesRes.value.data);
        }

        if (zonesRes.status === "fulfilled" && zonesRes.value?.data) {
          setZones(zonesRes.value.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load staff details");
        toast.error("Failed to load staff details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Resolve role name
  const getRoleName = (roleId) => {
    if (!roleId) return "—";
    const role = roles.find((r) => r._id === roleId);
    return role ? role.roleName : `Unknown (${roleId})`;
  };

  // Resolve area / zone name
  const getAreaName = (areaVal) => {
    if (!areaVal) return "—";
    if (typeof areaVal === "object") {
      return areaVal.zoneName || areaVal.name || "—";
    }
    const zone = zones.find((z) => z._id === areaVal);
    return zone ? zone.zoneName : areaVal;
  };

  // Normalize status
  const formatStatus = (status) => {
    if (status === "active" || status === "true" || status === true) return "Active";
    if (status === "inactive" || status === "false" || status === false) return "Inactive";
    return status || "—";
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const displayStaff = staff || {};

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
      <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
      <div className="w-2/3 p-[2px] break-words">{value || "—"}</div>
    </div>
  );

  return (
    <>
      <h3 className="text-2xl font-semibold">Staff Details</h3>

      <div className="flex justify-between mb-1">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <FaLongArrowAltLeft /> Back
        </button>

        {/* ACTION BUTTONS (RIGHT SIDE) */}
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <button
            onClick={() =>
              navigate(`/staff/update/${staff?._id || id}`, {
                state: { from: `/staff/view/${id}` },
              })
            }
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Staff Name" value={displayStaff.name || displayStaff.staffName} />
          <Row label="User ID" value={displayStaff.logId} />
          <Row label="Mobile No." value={displayStaff.phoneNo} />
          <Row label="E-Mail" value={displayStaff.email} />
          <Row label="Role" value={getRoleName(displayStaff.role)} />
          <Row label="Status" value={formatStatus(displayStaff.status)} />
          <Row label="Salary" value={displayStaff.salary ? `₹${displayStaff.salary}` : "—"} />
          {/* <Row label="Area" value={getAreaName(displayStaff.area)} />
          <Row label="Address" value={displayStaff.address} />
          <Row label="Staff IP" value={displayStaff.staffIp} />
          <Row label="Bio" value={displayStaff.bio} /> */}
          <Row label="Comment" value={displayStaff.comment} />
          <Row label="Created At" value={formatDate(displayStaff.createdAt)} />
          <Row label="Updated At" value={formatDate(displayStaff.updatedAt)} />
        </div>
      </div>
    </>
  );
}