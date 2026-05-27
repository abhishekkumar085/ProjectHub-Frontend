import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiFolder,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiSearch,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
import plusIcon from "../../assets/plus icon.png";

import StatusBadge from "./StatusBadge";
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
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const userRole = String(currentUser?.role || "").toUpperCase();

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

  const handleDelete = async (id: string) => {
    await deleteProject(id);

    // refresh current page after deletion
    await fetchProjects();
  };

  return (
    <div className="rounded-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm font-[Poppins] mb-2">
        <Link to="/" className="text-[#0059FF] hover:underline">
          Home
        </Link>
        <FiChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-500">Projects</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-[#00076F]">
            Projects
          </h2>
          <p className="text-sm text-slate-500">({total} results found)</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search"
              className="h-[40px] sm:h-[45px] w-full sm:w-80 rounded-lg border border-[#DCDCDC] bg-white py-3 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {userRole !== "MANAGER" && (
            <button
              onClick={() => navigate("/projects/add-edit")}
              className="inline-flex h-[40px] sm:h-[45px] items-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-white whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
              }}
            >
              <img src={plusIcon} alt="+" className="h-4 w-4 object-contain" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiFolder size={30} />
            </div>

            <h3 className="text-lg font-semibold">No projects yet</h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Create your first project to start tracking work, developers, and
              documents.
            </p>
          </div>
        ) : (
          <table className="min-w-[700px] w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr className="h-[45px] bg-[#EEF4FF]">
                <th className="w-[90px] pl-[30px] pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none rounded-l-lg">
                  Sr. No.
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Project Name
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Status
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Environments
                </th>

                <th className="pl-3 pr-[30px] py-2 text-center text-sm font-medium text-[#161616] font-[Poppins] leading-none rounded-r-lg">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {items.map((p, index) => (
                <tr key={p.id} className="h-[45px] bg-white hover:bg-slate-50 ">
                  <td className="w-[80px] pl-[30px] pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none rounded-l-lg border-y border-l border-[#F5F5F5]">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {p.name}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5]">
                    <StatusBadge status={p.status} />
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5]">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.devUrl && (
                        <a
                          href={p.devUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-[#EEF4FF] px-2 py-1 text-xs font-medium text-[#0059FF]"
                        >
                          DEV <FiExternalLink size={10} />
                        </a>
                      )}
                      {p.uatUrl && (
                        <a
                          href={p.uatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-[#FFF4E5] px-2 py-1 text-xs font-medium text-[#B76E00]"
                        >
                          UAT <FiExternalLink size={10} />
                        </a>
                      )}
                      {p.prodUrl && (
                        <a
                          href={p.prodUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-[#E8F5E9] px-2 py-1 text-xs font-medium text-[#2E7D32]"
                        >
                          PROD <FiExternalLink size={10} />
                        </a>
                      )}
                      {!p.devUrl && !p.uatUrl && !p.prodUrl && (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>

                  <td className="pl-3 pr-[30px] py-2 text-center rounded-r-lg border-y border-r border-[#F5F5F5]">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/projects/view/${p.id}`)}
                        className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#EEF4FF] text-[#0059FF] hover:bg-[#dde9ff]"
                      >
                        <FiEye size={16} />

                        
                      </button>
                      <button
                        onClick={() =>
                          navigate("/projects/add-edit", {
                            state: { projectId: p.id },
                          })
                        }
                        className="relative flex h-[32px] w-[32px] items-center justify-center rounded-[8px] gap-2 p-2 bg-[#EEF4FF] text-[#0059FF] hover:bg-[#dde9ff]"
                      >
                        <FiEdit2 size={16} />
                        {/* Red Dot */}
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      </button>
                      

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFECED] text-[#AF232A] hover:bg-[#ffe0e1]"
                      >
                        <FiTrash2 size={16} />
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
