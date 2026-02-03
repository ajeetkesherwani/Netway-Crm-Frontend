import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import { getHardwareById, getAllUserList } from "../../service/hardware";

export default function HardwareView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hw, setHw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getHardwareById(id);
        const data = res?.data ?? res ?? null;
        setHw(data);
      } catch (err) {
        setError(err?.message || "Failed to load hardware");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUserList();
        const list = Array.isArray(res) ? res : res?.data ?? res?.users ?? [];
        const map = {};
        list.forEach((u) => {
          const uid = u._id || u.id;
          const name = u.generalInformation?.name || u.name || u.fullName || u.email || uid;
          if (uid) map[uid] = name;
        });
        setUsersMap(map);
      } catch {
        // ignore
      }
    };
    loadUsers();
  }, []);

  if (loading) return <p className="p-4">Loading hardware...</p>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!hw) return <p className="p-4">No hardware found.</p>;

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  const assignedLabel = hw.assignedTo ? (usersMap[hw.assignedTo] || hw.assignedTo) : "—";

  return (
    <div className="p-6  mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{hw.hardwareName || "Hardware Details"}</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Back</button>
          <ProtectedAction module="hardware" action="Edit">
            <button onClick={() => navigate(`/setting/hardware/update/${hw._id || hw.id}`)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
              <FaEdit className="mr-2" /> Edit
            </button>
          </ProtectedAction>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Name</div>
          <div className="font-medium">{hw.hardwareName || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Type</div>
          <div className="font-medium">{hw.hardwareType || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Brand</div>
          <div className="font-medium">{hw.brand || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Model</div>
          <div className="font-medium">{hw.model || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Serial Number</div>
          <div className="font-medium">{hw.serialNumber || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">IP Address</div>
          <div className="font-medium">{hw.ipAddress || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">MAC Address</div>
          <div className="font-medium">{hw.macAddress || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Port Count</div>
          <div className="font-medium">{hw.portCount ?? "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Cable Length</div>
          <div className="font-medium">{hw.cableLength || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Location</div>
          <div className="font-medium">{hw.location || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Purchase Date</div>
          <div className="font-medium">{formatDate(hw.purchaseDate)}</div>
        </div>

        <div>
          <div className="text-gray-500">Warranty Expiry</div>
          <div className="font-medium">{formatDate(hw.warrantyExpiry)}</div>
        </div>

        <div>
          <div className="text-gray-500">Price</div>
          <div className="font-medium">{hw.price != null ? `₹ ${hw.price}` : "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Status</div>
          <div className="font-medium">{hw.status || "-"}</div>
        </div>

        <div className="md:col-span-2">
          <div className="text-gray-500">Notes</div>
          <div className="font-medium whitespace-pre-wrap">{hw.notes || "-"}</div>
        </div>

        <div>
          <div className="text-gray-500">Assigned To</div>
          <div className="font-medium">{assignedLabel}</div>
        </div>

        <div>
          <div className="text-gray-500">Created At</div>
          <div className="font-medium">{formatDate(hw.createdAt)}</div>
        </div>
        <div>
          <div className="text-gray-500">Updated At</div>
          <div className="font-medium">{formatDate(hw.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
}