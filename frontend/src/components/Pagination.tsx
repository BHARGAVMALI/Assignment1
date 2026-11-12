interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button className="btn small" disabled={page === 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button className="btn small" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}