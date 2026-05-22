import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFolder,
  FiPlus,
  FiTrash2,
  // FiFileText,
  FiEdit2,
  FiEye,
} from "react-icons/fi";


import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import type { Project } from "./types/project.types";
import { deleteProject, listProjects } from "./api/projectApi";
import Pagination from "../../components/common/Pagination";



function Projects() {
  // const [items, setItems] = useState<Project[]>([]);
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();

  // const user = JSON.parse(
  //   localStorage.getItem("user") || "{}"
  // );

  // const userRole = user.role;


  const fetchProjects = async (requestedPage = page) => {
    try {
      setLoading(true);

      const data = await listProjects(requestedPage, limit);
      console.log("Fetched projects:", data);

      setItems(data.projects);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    await deleteProject(id);

    // refresh current page after deletion
    await fetchProjects();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {total} total projects
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/add-edit")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus />
          New Project
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
              <FiFolder size={30} />
            </div>

            <h3 className="text-lg font-semibold">
              No projects yet
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Create your first project to start
              tracking work, developers, and
              documents.
            </p>
          </div>
        ) : (
          <table className="min-w-full table-fixed divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="w-[20%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Name
                </th>

                <th scope="col" className="w-[15%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th scope="col" className="w-[15%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Priority
                </th>

                <th className="w-[15%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Start Date
                </th>

                <th className="w-[15%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  End Date
                </th>

                {/* <th scope="col" className="w-[14%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Documents
                </th> */}
                <th scope="col" className="w-[15%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>

                {/* <th className="px-4 py-4"></th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="w-[20%] px-4 py-5">
                    <div className=" text-slate-900">
                      {p.name}
                    </div>
                  </td>

                  <td className="w-[15%] px-4 py-5">
                    <StatusBadge
                      status={p.status}
                    />
                  </td>

                  <td className="w-[15%] px-4 py-5 text-center">
                    <PriorityBadge
                      priority={p.priority}
                    />
                  </td>

                  {/* <td className="px-4 py-5">
                    <div className="flex flex-wrap gap-2">
                      {p.developers.map((d) => (
                        <span
                          key={d}
                          className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </td> */}

                  {/* <td className="w-[14%] px-4 py-5 text-center">
                    <button
                      onClick={() => {
                        setSelectedDocuments(
                          p.documents
                        );

                        setSelectedProjectName(
                          p.name
                        );

                        setDocumentModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    >
                      <FiEye />
                    </button>
                  </td> */}
                  <td className="w-[15%] px-4 py-5">
                    <div className="text-slate-900">
                      {p.startDate
                        ? new Date(p.startDate)
                          .toLocaleDateString('en-GB')
                          .replace(/\//g, '-')
                        : '-'}
                    </div>
                  </td>
                  <td className="w-[15%] px-4 py-5">
                    <div className="text-slate-900">
                      {p.endDate
                        ? new Date(p.endDate)
                          .toLocaleDateString('en-GB')
                          .replace(/\//g, '-')
                        : '-'}
                    </div>
                  </td>
                  <td className="w-[15%] px-4 py-5 text-center">
                    <div className="inline-flex items-start justify-end gap-2">
                      <button
                        onClick={() => navigate("/projects/add-edit", { state: { projectId: p.id, viewOnly: true } })}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <FiEye />
                      </button>

                      <button
                        onClick={() => navigate("/projects/add-edit", { state: { projectId: p.id } })}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(p.id)
                        }
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                  {/* <td className="w-[15%] px-4 py-5 text-center">
                    <button
                      onClick={() => navigate("/projects/add-edit", { state: { projectId: p.id, viewOnly: true } })}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <FiEye />
                    </button>
                  </td> */}
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
          if (page > 1) fetchProjects(page - 1);
        }}
        onNext={() => {
          if (page < totalPages) fetchProjects(page + 1);
        }}
        onPageChange={(pageNumber) => fetchProjects(pageNumber)}
      />
    </div>
  );
}

export default Projects;