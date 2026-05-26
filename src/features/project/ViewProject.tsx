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

function ViewProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // FIXED

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (!id) {
      setLoadError("Project ID is missing.");
      return;
    }

    setLoading(false);
    setLoadError(null);
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
          onClick={() => navigate("/managers")}
          className="inline-flex items-center gap-2 px-4 py-2 font-[Poppins] font-medium text-[14px] leading-[120%] tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}

export default ViewProject;
