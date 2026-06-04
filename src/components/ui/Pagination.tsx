import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-charcoal/12 text-charcoal/40 hover:border-gold hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <ChevronLeftIcon sx={{ fontSize: 16 }} className="rtl:rotate-180" />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-9 h-9 flex items-center justify-center text-charcoal/25 text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
              currentPage === page
                ? "gold-gradient text-charcoal shadow-md shadow-gold/20 scale-105"
                : "border border-charcoal/12 text-charcoal/50 hover:border-gold/60 hover:text-charcoal"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-charcoal/12 text-charcoal/40 hover:border-gold hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        <ChevronRightIcon sx={{ fontSize: 16 }} className="rtl:rotate-180" />
      </button>
    </div>
  );
}
