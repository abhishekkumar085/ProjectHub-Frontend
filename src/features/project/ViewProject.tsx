import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewProject() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        <p className="text-sm text-slate-500">Loading project details…</p>
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
      <div className="grid grid-cols-1 gap-6">
        HIII
      </div>
    </div>
  );
}

export default ViewProject;
