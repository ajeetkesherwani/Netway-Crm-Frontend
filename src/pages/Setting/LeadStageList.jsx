import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEllipsisV, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createLeadStage,
  deleteLeadStage,
  getLeadStages,
  updateLeadStage,
} from "../../service/leadStage";

const getStageId = (stage) => stage?._id || stage?.id;

export default function LeadStageList() {
  const [stages, setStages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [leadName, setLeadName] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadStages = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getLeadStages();
        if (active) setStages(result);
      } catch (requestError) {
        if (active) {
          setStages([]);
          setError(requestError.message || "Failed to load lead stages.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStages();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const openCreateModal = () => {
    setEditingStage(null);
    setLeadName("");
    setSortOrder("");
    setModalError("");
    setModalOpen(true);
  };

  const openEditModal = (stage) => {
    setEditingStage(stage);
    setLeadName(stage.leadName || "");
    setSortOrder(String(stage.sortOrder ?? ""));
    setModalError("");
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingStage(null);
    setModalError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const normalizedName = leadName.trim();
    const normalizedSortOrder = Number(sortOrder);
    if (!normalizedName) {
      setModalError("Enter a lead stage name.");
      return;
    }
    if (!Number.isInteger(normalizedSortOrder) || normalizedSortOrder < 0) {
      setModalError("Sort order must be a non-negative whole number.");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      const payload = { leadName: normalizedName, sortOrder: normalizedSortOrder };
      if (editingStage) {
        await updateLeadStage(getStageId(editingStage), payload);
        toast.success("Lead stage updated successfully.");
      } else {
        await createLeadStage(payload);
        toast.success("Lead stage created successfully.");
      }
      setModalOpen(false);
      setEditingStage(null);
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setModalError(requestError.message || "Failed to save lead stage.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (stage) => {
    const id = getStageId(stage);
    if (!id) {
      toast.error("Cannot delete a lead stage without an ID.");
      return;
    }
    if (!window.confirm(`Delete lead stage "${stage.leadName}"?`)) return;

    try {
      await deleteLeadStage(id);
      toast.success("Lead stage deleted successfully.");
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      toast.error(requestError.message || "Failed to delete lead stage.");
    }
  };

  const filteredStages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return stages
      .filter((stage) => String(stage.leadName || "").toLowerCase().includes(query))
      .sort((left, right) => Number(left.sortOrder) - Number(right.sortOrder));
  }, [stages, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Lead Stages</h1>
          <p className="mt-1 text-sm text-gray-500">Manage lead stage names and display order.</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="flex min-w-0 max-w-md flex-1 items-center overflow-hidden rounded-md border border-gray-300 bg-white">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lead stages"
              aria-label="Search lead stages"
              className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
            />
            <span className="px-3 text-gray-500" aria-hidden="true"><FaSearch /></span>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FaPlus /> Add Lead Stage
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-gray-100 text-left text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">S.No</th>
              <th className="px-4 py-3 font-semibold">Lead Stage Name</th>
              <th className="px-4 py-3 font-semibold">Sort Order</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading lead stages...</td></tr>
            ) : filteredStages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {search ? "No matching lead stages found." : "No lead stages found."}
                </td>
              </tr>
            ) : (
              filteredStages.map((stage, index) => {
                const id = getStageId(stage);
                return (
                  <tr key={id || stage.leadName} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{stage.leadName}</td>
                    <td className="px-4 py-3 text-gray-600">{stage.sortOrder}</td>
                    <td className="relative px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Actions for ${stage.leadName}`}
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
                            onClick={() => openEditModal(stage)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FaEdit className="text-blue-600" /> Edit
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(stage);
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
          <div role="dialog" aria-modal="true" aria-labelledby="lead-stage-dialog-title" className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 id="lead-stage-dialog-title" className="text-lg font-semibold text-gray-900">
              {editingStage ? "Edit Lead Stage" : "Add Lead Stage"}
            </h2>
            {modalError && (
              <div role="alert" className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{modalError}</div>
            )}
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Lead Stage Name
                <input
                  type="text"
                  value={leadName}
                  onChange={(event) => setLeadName(event.target.value)}
                  required
                  autoFocus
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Sort Order
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  required
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? "Saving..." : editingStage ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
