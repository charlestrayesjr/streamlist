function FilterBar({ filter, onFilterChange }) {
  const filters = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="filter-bar" aria-label="StreamList filters">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={filter === value ? "filter-active" : ""}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
