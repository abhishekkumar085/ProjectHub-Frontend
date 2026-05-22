interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange?: (page: number) => void;
}

function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canShowPageButtons = totalPages <= 7 && typeof onPageChange === "function";
  const pageButtons = canShowPageButtons
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [];

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        Showing page {page} of {totalPages} — {total} total
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-lg px-3 py-1 bg-slate-100 disabled:opacity-50"
        >
          Prev
        </button>

        {canShowPageButtons ? (
          pageButtons.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange?.(pageNumber)}
              className={`rounded-lg px-3 py-1 border ${
                pageNumber === page
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNumber}
            </button>
          ))
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            {page} / {totalPages}
          </span>
        )}

        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-lg px-3 py-1 bg-slate-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
