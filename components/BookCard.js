"use client";

import { getStatusMeta, BOOK_STATUSES } from "@/lib/constants";

export default function BookCard({ book, onEdit, onDelete, onStatusChange }) {
  const statusMeta = getStatusMeta(book.status);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
        <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2.5 py-1 whitespace-nowrap">
          {statusMeta.emoji} {statusMeta.label}
        </span>
      </div>

      {book.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-md px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 mt-1">
        <select
          value={book.status}
          onChange={(e) => onStatusChange(book._id, e.target.value)}
          className="text-xs border cursor-pointer border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          {BOOK_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(book)}
            className="text-xs cursor-pointer font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="text-xs cursor-pointer font-medium text-red-500 hover:text-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}