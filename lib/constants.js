export const BOOK_STATUSES = [
  { value: "want-to-read", label: "Want to Read", emoji: "📖" },
  { value: "reading", label: "Reading", emoji: "📘" },
  { value: "completed", label: "Completed", emoji: "✅" },
];

export function getStatusMeta(value) {
  return (
    BOOK_STATUSES.find((s) => s.value === value) || BOOK_STATUSES[0]
  );
}