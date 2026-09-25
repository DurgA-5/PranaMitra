import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage, // 1-indexed
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm text-sm text-slate-600">
      {/* Items Range Info */}
      <div className="flex items-center gap-4">
        <div>
          Showing <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startItem}</span> to{" "}
          <span className="font-bold text-slate-800">{endItem}</span> of{" "}
          <span className="font-bold text-slate-800">{totalItems}</span> entries
        </div>

        {/* Page Size Select */}
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-red-500 focus:outline-none"
            aria-label="Items per page"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination Navigation">
        {/* Previous button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`p-2 rounded-xl border border-slate-200 transition focus:outline-none focus:ring-2 focus:ring-slate-100 ${
            currentPage === 1
              ? "text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed"
              : "text-slate-600 bg-white hover:bg-slate-50"
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page number buttons */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl font-semibold border transition focus:outline-none focus:ring-2 ${
              currentPage === page
                ? "bg-red-600 border-red-600 text-white focus:ring-red-100"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 focus:ring-slate-100"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`p-2 rounded-xl border border-slate-200 transition focus:outline-none focus:ring-2 focus:ring-slate-100 ${
            currentPage === totalPages
              ? "text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed"
              : "text-slate-600 bg-white hover:bg-slate-50"
          }`}
          aria-label="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
