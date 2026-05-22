import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBriefcase, FiMail, FiPhone, FiUser } from "react-icons/fi";
import type { Project } from "../project/types/project.types";
import { listProjectsForUser } from "../project/api/projectApi";
import StatusBadge from "../project/StatusBadge";
import PriorityBadge from "../project/PriorityBadge";

function ViewDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manager, setManager] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!id) {
      setError("Manager ID is missing.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);

        const result = await listProjectsForUser(id);

        setManager(result.manager || null);
        setProjects(result.projects ?? []);
        console.log("Fetched manager details:", result.manager);
        console.log("Fetched projects for manager:", result.projects);
      } catch (err) {
        setError("Unable to load manager details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Manager Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review the manager profile and project assignments.
          </p>
        </div>

        <button
          onClick={() => navigate("/managers")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span className="hidden sm:inline">Back to managers</span><span className="sm:hidden">Back</span>
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-600">Loading...</div>
      ) : error ? (
        <div className="p-10 text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="flex items-center gap-3 text-slate-900">
                <div className="rounded-2xl bg-blue-500 p-3 text-white">
                  <FiUser />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{manager?.name}</h3>
                  <p className="text-sm text-slate-500">{manager?.designation}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiMail className="text-slate-400" />
                  <span>{manager?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-slate-400" />
                  <span>{manager?.empId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-slate-400" />
                  <span>{manager?.mobileNumber ?? "No mobile number provided"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Project Summary
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {projects.length} assigned project{projects.length === 1 ? "" : "s"}.
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {projects.length}
                </div>
              </div>

              {/* <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiUser className="text-slate-400" />
                  <span>Manager ID: {manager?.id}</span>
                </div>
              </div> */}
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Details for projects connected to this manager.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                No projects found for this manager.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                  <details
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <summary className="flex cursor-pointer flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-white px-3 sm:px-5 py-3 sm:py-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{project.name}</p>
                        <p className="text-sm text-slate-500 truncate">{project.description ?? "No description available."}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <StatusBadge status={project.status} />
                        <PriorityBadge priority={project.priority} />
                      </div>
                    </summary>

                    <div className="border-t border-slate-200 bg-slate-50 px-3 sm:px-5 py-4 sm:py-5 text-sm text-slate-600">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Client</p>
                          <p className="mt-1 text-slate-900">{project.clientName ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Start date</p>
                          <p className="mt-1 text-slate-900">{formatDate(project.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">End date</p>
                          <p className="mt-1 text-slate-900">{formatDate(project.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Developers</p>
                          <p className="mt-1 text-slate-900">{project.developers?.join(", ") || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Documents</p>
                          <p className="mt-1 text-slate-900">{project.documents?.length ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">URLs</p>
                          <div className="mt-1 space-y-1 text-slate-900">
                            <p>{project.devUrl ?? "Dev: —"}</p>
                            <p>{project.uatUrl ?? "UAT: —"}</p>
                            <p>{project.prodUrl ?? "Prod: —"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default ViewDetails;
