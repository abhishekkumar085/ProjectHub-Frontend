import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiUsers, FiEye } from "react-icons/fi";
import { deleteManager, listManagers } from "./api/managerApi";
import type { Manager } from "./types/manager.types";
import Pagination from "../../components/common/Pagination";

function Managers() {
    const [items, setItems] = useState<Manager[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                    onClick={() => navigate("/managers/add")}
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
                    <table className="min-w-full w-full table-fixed divide-y divide-slate-200">
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

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Mobile Number
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-slate-200">
                            {items.map((manager) => (
                                <tr
                                    key={manager.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {manager.name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {manager.email}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {manager.empId}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {manager.designation}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {manager.mobileNumber}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/users/${manager.id}/projects`)}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                            >
                                                <FiEye />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(manager.id)}
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

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPrev={() => {
                    if (page > 1) {
                        fetchManagers(page - 1);
                    }
                }}
                onNext={() => {
                    if (page < totalPages) {
                        fetchManagers(page + 1);
                    }
                }}
                onPageChange={(pageNumber) => fetchManagers(pageNumber)}
            />
        </div>
    );
}

export default Managers;