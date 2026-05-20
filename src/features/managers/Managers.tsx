import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiUsers, FiEdit2 } from "react-icons/fi";
import { deleteManager, listManagers } from "./api/managerApi";
import type { Manager } from "./types/manager.types";
import ManagerFormModal from "./ManagerFormModal";


function Managers() {
    const [items, setItems] = useState<Manager[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);




    
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

    const fetchManagers =
        async (p = page) => {
            try {
                setLoading(true);

                const res = await listManagers(p, limit);

                setItems(res.users);
                setTotal(res.total);
                setTotalPages(res.totalPages);
                setPage(res.page);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleDelete = async (
        id: string
    ) => {
        await deleteManager(id);

        // refresh current page
        await fetchManagers(page);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Managers
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {total} total managers
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedManager(
                            null
                        );

                        setOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <FiPlus />

                    Add Manager
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-10 text-center">
                        Loading...
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-14 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <FiUsers size={30} />
                        </div>

                        <h3 className="text-lg font-semibold">
                            No managers found
                        </h3>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Name
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Employee ID
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Designation
                                </th>

                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((manager) => (
                                <tr
                                    key={manager.id}
                                    className="border-t border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-6 py-5 font-medium">
                                        {
                                            manager.name
                                        }
                                    </td>

                                    <td className="px-6 py-5">
                                        {manager.email}
                                    </td>

                                    <td className="px-6 py-5">
                                        {
                                            manager.empId
                                        }
                                    </td>

                                    <td className="px-6 py-5">
                                        {
                                            manager.designation
                                        }
                                    </td>


                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedManager(
                                                        manager
                                                    );

                                                    setOpen(
                                                        true
                                                    );
                                                }}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                            >
                                                <FiEdit2 />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        manager.id
                                                    )
                                                }
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 p-4">
                    <div className="text-sm text-slate-600">
                        Showing page {page} of {totalPages} — {total} total
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (page > 1) {
                                    fetchManagers(page - 1);
                                }
                            }}
                            disabled={page <= 1}
                            className="rounded-lg px-3 py-1 bg-slate-100 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <button
                            onClick={() => {
                                if (page < totalPages) {
                                    fetchManagers(page + 1);
                                }
                            }}
                            disabled={page >= totalPages}
                            className="rounded-lg px-3 py-1 bg-slate-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <ManagerFormModal
                open={open}
                onClose={() =>
                    setOpen(false)
                }
                refresh={fetchManagers}
                manager={selectedManager}
            />
        </div>
    );
}

export default Managers;