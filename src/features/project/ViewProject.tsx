import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Folder,
  FileText,
  Users,
  Hourglass,
  ListOrdered,
  UserCircle,
  CalendarDays,
  Eye,
  User,
} from "lucide-react";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { getProjectById } from "./api/projectApi";
import type { Project } from "./types/project.types";

function ViewProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (!id) {
      setLoadError("Project ID is missing.");
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const data = await getProjectById(id);
        if (!data) {
          setLoadError("Project data not found.");
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (error: any) {
        console.error("Failed to load project details:", error);
        setLoadError(error?.message || "Failed to load project details.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
        <p className="text-sm text-slate-500">Loading project details...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
        <p className="text-sm text-red-500">{loadError}</p>
      </div>
    );
  }

  const getDocumentUrl = (doc: any) => {
    const docBaseUrl = import.meta.env.VITE_DOC_VIEW_URL?.replace(/\/$/, "");
    const rawUrl = doc?.url || doc?.path || doc?.fileUrl || "";

    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return String(rawUrl);
    if (docBaseUrl) {
      const cleanPath = String(rawUrl).startsWith("/")
        ? String(rawUrl).slice(1)
        : String(rawUrl);
      return `${docBaseUrl}/${cleanPath}`;
    }
    return String(rawUrl);
  };

  const projectData = [
    {
      icon: <Folder size={20} className="text-blue-600" />,
      label: "PROJECT NAME",
      value: project?.name || "-",
    },
    {
      icon: <FileText size={20} className="text-blue-600" />,
      label: "DESCRIPTION",
      value: project?.description || "-",
    },
    {
      icon: <Users size={20} className="text-blue-600" />,
      label: "DEVELOPERS",
      value: project?.developers?.join(", ") || "-",
    },
  ];

  const bottomData = [
    {
      icon: <Hourglass size={20} className="text-blue-600" />,
      label: "STATUS",
      value: project?.status || "-",
    },
    {
      icon: <ListOrdered size={20} className="text-blue-600" />,
      label: "PRIORITY",
      value: project?.priority || "-",
    },
    {
      icon: <UserCircle size={20} className="text-blue-600" />,
      label: "CLIENT",
      value: project?.clientName || "-",
    },
    {
      icon: <CalendarDays size={20} className="text-blue-600" />,
      label: "START DATE",
      value: project?.startDate
        ? new Date(project.startDate).toLocaleDateString()
        : "-",
    },
    {
      icon: <CalendarDays size={20} className="text-blue-600" />,
      label: "END DATE",
      value: project?.endDate
        ? new Date(project.endDate).toLocaleDateString()
        : "-",
    },
  ];

  const files = project?.documents?.map((doc: any) => ({
    name:
      doc?.originalName || doc?.name || doc?.filename ||
      String(doc?.url || "").split("/").pop() || "Untitled",
    url: getDocumentUrl(doc),
    type: doc?.fileType || doc?.mimeType || "file",
  })) || [];

  const remarksData = [
    {
      id: 1,
      name: "Yasmeen Hedge",
      time: "22/05/2026 03:30 PM",
      remark:
        "The project timeline has been extended due to unforeseen challenges and additional requirement updates during the development phase.",
    },
    {
      id: 2,
      name: "Siddhesh Katre",
      time: "22/05/2026 03:30 PM",
      remark: "Thank you for your understanding regarding the project delay.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm font-[Poppins] mb-2">
        <Link to="/" className="text-[#0059FF] hover:underline">
          Home
        </Link>
        <FiChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-500">Users</span>
        <FiChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-500">Project Details</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
        <h1 className="mt-5 font-[Poppins] text-[20px] font-semibold leading-[100%] tracking-[0px] text-[#00076F]">
          Project Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 font-[Poppins] font-medium text-[14px] leading-[120%] tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
        <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-3 mt-3">
          Basic Information
        </h1>

        <div className="space-y-6">
          {projectData.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 min-w-[48px] flex items-center justify-center rounded-lg bg-[#EAF2FF]">
                {item.icon}
              </div>

              <div className="flex-1 space-y-2">
                <p className="font-medium text-xs uppercase text-[#7A7A7A]">
                  {item.label}
                </p>

                <p className="font-medium text-sm sm:text-base leading-6 text-[#1E1E1E]">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {bottomData.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 min-w-[48px] flex items-center justify-center rounded-lg bg-[#EAF2FF]">
                {item.icon}
              </div>

              <div className="flex-1 space-y-2">
                <p className="font-medium text-xs uppercase text-[#7A7A7A]">
                  {item.label}
                </p>

                <p className="font-medium text-sm sm:text-base leading-6 text-[#1E1E1E] break-words">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Card */}
      <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
        <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-4">
          Documents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#EEF4FF] rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <FileText size={22} className="text-[#0059FF]" />
                  </div>

                  <p className="font-medium text-sm sm:text-base text-[#1E1E1E] truncate">
                    {file.name}
                  </p>
                </div>

                <a
                  href={file.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-3"
                >
                  <Eye size={20} className="text-[#00076F]" />
                </a>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#f9fafc] px-4 py-6 text-sm text-slate-500">
              No documents available
            </div>
          )}
        </div>
      </div>

      {/* Remarks Card */}
      <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
        <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-4">
          Remarks
        </h1>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start mb-5">
          <textarea
            placeholder="Enter Here..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="
              w-full
              border border-gray-300
              rounded-xl
              p-3 sm:p-4
              text-sm sm:text-base
              outline-none
              resize-none
              h-24 sm:h-20
              focus:ring-2 focus:ring-blue-500
            "
          />

          <button
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5 sm:px-6
              py-3
              rounded-xl
              font-medium
              transition-all
              w-full sm:w-auto
              min-w-[100px]
            "
          >
            Save
          </button>
        </div>

        {/* Remarks List */}
        <div className="space-y-4">
          {remarksData.map((item) => (
            <div key={item.id} className="bg-[#F5F5F5] rounded-2xl p-4 sm:p-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="    w-8
    h-8
    rounded-[20px]
    flex
    items-center
    justify-center
    bg-white
    opacity-100"
                  >
                    <User size={14} className="text-blue-500" />
                  </div>

                  <h3
                    className=" font-[Poppins]
    font-medium
    text-[14px]
    leading-[100%]
    tracking-[0%]
    text-[#7A7A7A]"
                  >
                    {item.name}
                  </h3>
                </div>

                <span className="text-xs sm:text-sm text-gray-500">
                  {item.time}
                </span>
              </div>

              {/* Remark Text */}
              <p
                className="
    font-[Poppins]
    font-medium
    text-[14px]
    leading-[100%]
    tracking-[0%]
    text-[#161616]
  "
              >
                {item.remark}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewProject;
