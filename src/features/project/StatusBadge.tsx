interface Props {
  status: string;
}

const styles: Record<string, string> = {
  PLANNING: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default StatusBadge;