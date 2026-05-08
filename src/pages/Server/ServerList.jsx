import React, { useEffect, useState } from "react";
import {
    getServers,
    createServer,
    updateServer,
    deleteServer,
} from "../../service/serverApi";
import { FaEdit, FaTrash, FaEllipsisV, FaSearch } from "react-icons/fa";
import ProtectedAction from "../../components/ProtectedAction";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function ServerList() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [openMenuId, setOpenMenuId] = useState(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [formName, setFormName] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    // ✅ FETCH
    // const fetchServers = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await getServers({
    //             page,
    //             limit,
    //             search: appliedSearch,
    //         });

    //         if (res.status) {
    //             let list = res.data.data || [];

    //             // ✅ STRICT SEARCH FILTER (Frontend safety)
    //             if (appliedSearch) {
    //                 list = list.filter((s) =>
    //                     s.name.toLowerCase().includes(appliedSearch.toLowerCase())
    //                 );
    //             }

    //             setServers(list);
    //             setTotalPages(res.data.totalPages || 1);
    //         }
    //     } catch {
    //         toast.error("Failed to load servers");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchServers = async () => {
        setLoading(true);
        try {
            const res = await getServers({
                page,
                limit,
            }); // ❌ REMOVE search from API

            if (res.status) {
                let list = res.data.data || [];

                // ✅ STRICT SEARCH (same as pool)
                if (appliedSearch) {
                    list = list.filter((s) =>
                        s.name.toLowerCase().includes(appliedSearch.toLowerCase())
                    );
                }

                setServers(list);

                // ✅ IMPORTANT: fix pagination when filtering
                setTotalPages(appliedSearch ? 1 : res.data.totalPages || 1);
            }
        } catch {
            toast.error("Failed to load servers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServers();
    }, [page, appliedSearch]);

    // ✅ close dropdown
    useEffect(() => {
        const close = () => setOpenMenuId(null);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // ✅ CREATE
    const handleCreate = async () => {
        if (!formName.trim()) return toast.error("Name required");
        try {
            const res = await createServer({ name: formName.trim() });
            if (res.status) {
                toast.success("Server created");
                setCreateOpen(false);
                setFormName("");
                fetchServers();
            }
        } catch {
            toast.error("Create failed");
        }
    };

    // ✅ EDIT
    const handleEdit = (server) => {
        setSelectedId(server._id);
        setFormName(server.name);
        setEditOpen(true);
        setOpenMenuId(null);
    };

    const confirmUpdate = async () => {
        if (!formName.trim()) return toast.error("Name required");
        try {
            const res = await updateServer(selectedId, { name: formName.trim() });
            if (res.status) {
                toast.success("Updated");
                setEditOpen(false);
                setFormName("");
                fetchServers();
            }
        } catch {
            toast.error("Update failed");
        }
    };

    // ✅ DELETE
    const handleDelete = (id) => {
        setSelectedId(id);
        setDeleteOpen(true);
        setOpenMenuId(null);
    };

    const confirmDelete = async () => {
        try {
            const res = await deleteServer(selectedId);
            if (res.status) {
                toast.success("Deleted");
                fetchServers();
            }
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleteOpen(false);
        }
    };

    // ✅ SEARCH
    const handleSearch = () => {
        const trimmed = search.trim();
        setPage(1);
        setAppliedSearch(trimmed);
    };

    // ✅ EXPORT
    const exportExcel = () => {
        if (!servers.length) return toast.error("No data");

        const data = servers.map((s, i) => ({
            "S.No": i + 1,
            Name: s.name,
            CreatedAt: new Date(s.createdAt).toLocaleString(),
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Servers");
        XLSX.writeFile(wb, "servers.xlsx");
    };

    if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h1 className="text-xl font-semibold text-gray-800">Server List</h1>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex border rounded overflow-hidden bg-white">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search server..."
                            className="px-3 py-2 outline-none text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-3 flex items-center justify-center"
                        >
                            <FaSearch />
                        </button>
                    </div>

                    <button
                        onClick={exportExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                        Excel
                    </button>

                    <ProtectedAction module="server" action="Create">
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Add Server
                        </button>
                    </ProtectedAction>
                </div>
            </div>

            {/* TABLE */}
            {servers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No servers found
                </div>
            ) : (
                <div className="bg-white shadow rounded overflow-visible">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">S.N.</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {servers.map((s, i) => (
                                <tr key={s._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3 font-medium">{s.name}</td>
                                    <td className="p-3">
                                        {new Date(s.createdAt).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-center relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMenu(s._id);
                                            }}
                                            className="p-2 rounded hover:bg-gray-200"
                                        >
                                            <FaEllipsisV />
                                        </button>

                                        {openMenuId === s._id && (
                                            <div className="absolute right-0 mt-2 w-36 bg-white border shadow-lg rounded z-[9999]">
                                                <ProtectedAction module="server" action="Edit">
                                                    <button
                                                        onClick={() => handleEdit(s)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                </ProtectedAction>

                                                <ProtectedAction module="server" action="Delete">
                                                    <button
                                                        onClick={() => handleDelete(s._id)}
                                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </ProtectedAction>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-5">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* MODALS */}
            {createOpen && (
                <Modal title="Create Server" onClose={() => setCreateOpen(false)}>
                    <Input value={formName} setValue={setFormName} />

                    {/* flex buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCreate}
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>

                        <button
                            onClick={() => setCreateOpen(false)}
                            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {/* {editOpen && (
                <Modal title="Update Server" onClose={() => setEditOpen(false)}>
                    <Input value={formName} setValue={setFormName} />
                    <button className="btn-primary w-full" onClick={confirmUpdate}>
                        Update
                    </button>
                </Modal>
            )} */}
            {editOpen && (
                <Modal title="Update Server">
                    <Input value={formName} setValue={setFormName} />

                    <div className="flex gap-3">
                        <button
                            onClick={confirmUpdate}
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Update
                        </button>

                        <button
                            onClick={() => setEditOpen(false)}
                            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {deleteOpen && (
                <Modal title="Confirm Delete">
                    <p className="text-gray-600 mb-4">Delete this server?</p>

                    <div className="flex gap-3">
                        <button
                            onClick={confirmDelete}
                            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => setDeleteOpen(false)}
                            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// INPUT
const Input = ({ value, setValue }) => (
    <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter name"
        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />
);

// MODAL
const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            {/* content */}
            <div className="space-y-4">{children}</div>
        </div>
    </div>
);