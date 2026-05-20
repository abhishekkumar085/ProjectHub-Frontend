import { useEffect, useState } from "react";
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
import type { Project, ProjectDocument } from "./types/project.types";
import { deleteProject, listProjects } from "./api/projectApi";
import ProjectFormModal from "./ProjectFormModal";
import ProjectDocumentsModal from "./ProjectDocumentsModal";



function Projects() {
  // const [items, setItems] = useState<Project[]>([]);
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [documentModalOpen, setDocumentModalOpen] =
    useState(false);

const [selectedDocuments, setSelectedDocuments] =
  useState<ProjectDocument[]>([]);

  const [selectedProjectName, setSelectedProjectName] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userRole = user.role;


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

        {
          userRole === "MANAGER" && (
            <button
              onClick={() => {
                setSelectedProject(null);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiPlus />
              New Project
            </button>
          )
        }

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
                <th scope="col" className="w-[32%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Name
                </th>

                <th scope="col" className="w-[18%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th scope="col" className="w-[14%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Priority
                </th>
{/* 
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Developers
                </th> */}

                <th scope="col" className="w-[14%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Documents
                </th>
                <th scope="col" className="w-[14%] px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                  <td className="w-[32%] px-4 py-5">
                    <div className="font-semibold text-slate-900">
                      {p.name}
                    </div>

                    {p.clientName && (
                      <div className="mt-1 text-xs text-slate-500">
                        {p.clientName}
                      </div>
                    )}
                  </td>

                  <td className="w-[18%] px-4 py-5">
                    <StatusBadge
                      status={p.status}
                    />
                  </td>

                  <td className="w-[14%] px-4 py-5 text-center">
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

                  <td className="w-[14%] px-4 py-5 text-center">
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
                  </td>

                  <td className="w-[14%] px-4 py-5 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedProject(p);

                          setOpen(true);
                        }}
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
                if (page > 1) fetchProjects(page - 1);
              }}
              disabled={page <= 1}
              className="rounded-lg px-3 py-1 bg-slate-100 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => {
                if (page < totalPages) fetchProjects(page + 1);
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
      <ProjectFormModal
        open={open}
        onClose={() => setOpen(false)}
        refresh={fetchProjects}
        project={selectedProject}
      />
      <ProjectDocumentsModal
        open={documentModalOpen}
        onClose={() =>
          setDocumentModalOpen(false)
        }
        documents={selectedDocuments}
        projectName={selectedProjectName}
      />
    </div>
  );
}

export default Projects;