"use client";

import { BOOK_STATUSES } from "@/lib/constants";

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
  tagFilter,
  onTagFilterChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="text-sm border cursor-pointer border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        <option value="">All statuses</option>
        {BOOK_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.emoji} {s.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={tagFilter}
        onChange={(e) => onTagFilterChange(e.target.value)}
        placeholder="Filter by tag..."
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
    </div>
  );
}