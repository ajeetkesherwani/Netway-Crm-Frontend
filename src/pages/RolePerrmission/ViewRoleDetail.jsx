import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoleDetails } from "../../service/rolePermission";
import { IoMdArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ViewRoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [expandedCats, setExpandedCats] = useState({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getRoleDetails(id);
        setRole(res.data || res);
      } catch (err) {
        console.error("Error fetching role:", err);
        setError("Failed to load role details");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const displayRole = role || {};

  const toggleCategory = (cat) => {
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleAll = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    if (!displayRole.permissions) return;
    const newCats = {};
    Object.keys(displayRole.permissions).forEach((cat) => {
      newCats[cat] = newState;
    });
    setExpandedCats(newCats);
  };

  const Row = ({ label, value }) => (
    <div className="flex border-b last:border-b-0 md:border-r text-[14px]">
      <div className="w-1/3 bg-gray-100 p-[2px] font-medium">{label}</div>
      <div className="w-2/3 p-[2px] break-words">{value || "—"}</div>
    </div>
  );

  return (
    <>
      <h3 className="text-2xl font-semibold mb-1">Role Details</h3>

      <div className="flex justify-between mb-2">
        <button
          onClick={() => navigate("/role/list")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center gap-1 text-sm font-medium"
        >
          <IoMdArrowBack /> Back
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden shadow bg-white mb-6">
        <div className="bg-gray-50 p-2 border-b font-semibold text-gray-700">General Info</div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Row label="Role Name" value={displayRole.roleName} />
          <Row label="Status" value={displayRole.isActive ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-red-600 font-medium">No</span>} />
          <Row label="Created At" value={displayRole.createdAt ? new Date(displayRole.createdAt).toLocaleString() : "—"} />
          <Row label="Updated At" value={displayRole.updatedAt ? new Date(displayRole.updatedAt).toLocaleString() : "—"} />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <div className="bg-gray-50 p-2 border-b font-semibold text-gray-700 flex justify-between items-center">
          <span>Permissions</span>
          {displayRole.permissions && Object.keys(displayRole.permissions).length > 0 && (
            <button
              onClick={toggleAll}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {isAllExpanded ? (
                <>
                  <IoIosArrowUp /> Collapse All
                </>
              ) : (
                <>
                  <IoIosArrowDown /> Expand All
                </>
              )}
            </button>
          )}
        </div>
        <div className="p-4">
          {!displayRole.permissions || Object.keys(displayRole.permissions).length === 0 ? (
            <p className="text-gray-500 text-sm">No permissions defined.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(displayRole.permissions).map(([category, perms]) => {
                const permsEntries = Object.entries(perms);
                const isExpanded = expandedCats[category];
                const displayedPerms = isExpanded ? permsEntries : permsEntries.slice(0, 4);
                const hasMore = permsEntries.length > 4;

                return (
                  <div key={category} className="border rounded-md overflow-hidden shadow-sm">
                    <div
                      className={`bg-gray-100 px-3 py-1.5 text-sm font-medium border-b flex justify-between items-center ${
                        hasMore ? "cursor-pointer hover:bg-gray-200" : ""
                      }`}
                      onClick={() => hasMore && toggleCategory(category)}
                    >
                      <span className="capitalize">{category}</span>
                      {hasMore && (isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                    </div>
                    <div className="p-2 space-y-1 bg-white">
                      {displayedPerms.map(([perm, enabled]) => (
                        <div
                          key={perm}
                          className="flex justify-between items-center text-[13px] border-b last:border-b-0 pb-1 last:pb-0 pt-1 first:pt-0"
                        >
                          <span className="text-gray-600 capitalize">{perm}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      ))}
                      {!isExpanded && hasMore && (
                        <div
                          className="text-center text-xs text-blue-500 cursor-pointer pt-1 hover:underline"
                          onClick={() => toggleCategory(category)}
                        >
                          +{permsEntries.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}