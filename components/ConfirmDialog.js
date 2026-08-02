"use client";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-700 text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
        {message && (
          <p className="text-sm text-gray-500 mb-6">{message}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}