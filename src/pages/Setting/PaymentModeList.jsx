import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEllipsisV,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createPaymentMode,
  deletePaymentMode,
  getPaymentMode,
  getPaymentModes,
  updatePaymentMode,
} from "../../service/paymentMode";

const getModeId = (mode) => mode?._id || mode?.id;

const isModeActive = (mode) => {
  if (mode?.status === undefined || mode?.status === null) return true;
  return ["true", "1", "active"].includes(String(mode.status).toLowerCase());
};

const getAddedBy = (mode) => {
  const addedBy =
    mode.addedBy ??
    mode.addedByName ??
    mode.createdByName ??
    mode.createdBy ??
    mode.createdById ??
    mode.createdByRole;

  if (!addedBy) return "—";
  if (typeof addedBy !== "object") return String(addedBy);
  return (
    addedBy.name ||
    addedBy.fullName ||
    addedBy.staffName ||
    addedBy.adminName ||
    addedBy.username ||
    addedBy.userName ||
    addedBy.email ||
    addedBy._id ||
    addedBy.id ||
    "—"
  );
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN");
};

export default function PaymentModeList() {
  const [paymentModes, setPaymentModes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const [modeName, setModeName] = useState("");
  const [modeStatus, setModeStatus] = useState(true);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadPaymentModes = async () => {
      setLoading(true);
      setError("");
      try {
        const modes = await getPaymentModes();
        if (isCurrent) setPaymentModes(modes);
      } catch (requestError) {
        if (isCurrent) {
          setPaymentModes([]);
          setError(requestError.message || "Failed to load payment modes.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadPaymentModes();
    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const openCreateModal = () => {
    setEditingMode(null);
    setModeName("");
    setModeStatus(true);
    setModalError("");
    setModalOpen(true);
  };

  const openEditModal = async (mode) => {
    const id = getModeId(mode);
    if (!id) {
      toast.error("Cannot edit a payment mode without an ID.");
      return;
    }

    setEditingMode(mode);
    setModeName(mode.name || "");
    setModeStatus(isModeActive(mode));
    setModalError("");
    setModalLoading(true);
    setModalOpen(true);

    try {
      const currentMode = await getPaymentMode(id);
      setEditingMode(currentMode);
      setModeName(currentMode.name || "");
      setModeStatus(isModeActive(currentMode));
    } catch (requestError) {
      setModalError(requestError.message || "Failed to load payment mode.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    if (saving || modalLoading) return;
    setModalOpen(false);
    setEditingMode(null);
    setModalError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const name = modeName.trim();
    if (!name) {
      setModalError("Enter a payment mode name.");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      if (editingMode) {
        await updatePaymentMode(getModeId(editingMode), {
          name,
          status: modeStatus,
        });
        toast.success("Payment mode updated successfully.");
      } else {
        await createPaymentMode({ name });
        toast.success("Payment mode created successfully.");
      }

      setModalOpen(false);
      setEditingMode(null);
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setModalError(requestError.message || "Failed to save payment mode.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mode) => {
    const id = getModeId(mode);
    if (!id) {
      toast.error("Cannot delete a payment mode without an ID.");
      return;
    }
    if (!window.confirm(`Delete payment mode "${mode.name}"?`)) return;

    try {
      await deletePaymentMode(id);
      toast.success("Payment mode deleted successfully.");
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      toast.error(requestError.message || "Failed to delete payment mode.");
    }
  };

  const filteredModes = paymentModes.filter((mode) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      String(mode.name || "").toLowerCase().includes(query) ||
      getAddedBy(mode).toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payment Modes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the payment modes available when recording a payment.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FaPlus /> Add Payment Mode
        </button>
      </div>

      <div className="mb-4 flex max-w-md items-center overflow-hidden rounded-md border border-gray-300 bg-white">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search payment modes"
          aria-label="Search payment modes"
          className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
        />
        <span className="px-3 text-gray-500" aria-hidden="true">
          <FaSearch />
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-100 text-left text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">S.No</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Added Date</th>
              <th className="px-4 py-3 font-semibold">Added By</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading payment modes...
                </td>
              </tr>
            ) : filteredModes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {search ? "No matching payment modes found." : "No payment modes found."}
                </td>
              </tr>
            ) : (
              filteredModes.map((mode, index) => {
                const id = getModeId(mode);
                return (
                  <tr key={id || mode.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{mode.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(mode.createdAt || mode.addedAt || mode.createdOn)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getAddedBy(mode)}</td>
                    <td className="relative px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Actions for ${mode.name}`}
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === id}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId(openMenuId === id ? null : id);
                        }}
                        className="rounded p-2 text-gray-600 hover:bg-gray-100"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === id && (
                        <div
                          role="menu"
                          className="absolute right-2 top-12 z-20 w-36 rounded-md border border-gray-200 bg-white py-1 text-left shadow-lg"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuId(null);
                              openEditModal(mode);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaEdit className="text-blue-600" /> Edit
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(mode);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-mode-dialog-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
          >
            <h2 id="payment-mode-dialog-title" className="text-lg font-semibold text-gray-900">
              {editingMode ? "Edit Payment Mode" : "Add Payment Mode"}
            </h2>

            {modalError && (
              <div role="alert" className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
                <input
                  type="text"
                  value={modeName}
                  onChange={(event) => setModeName(event.target.value)}
                  required
                  autoFocus
                  disabled={saving || modalLoading}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </label>

              {editingMode && (
                <label className="block text-sm font-medium text-gray-700">
                  Status
                  <select
                    value={modeStatus ? "true" : "false"}
                    onChange={(event) => setModeStatus(event.target.value === "true")}
                    disabled={saving || modalLoading}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
              )}

              {modalLoading && (
                <p className="text-sm text-gray-500">Loading payment mode...</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || modalLoading}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || modalLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
