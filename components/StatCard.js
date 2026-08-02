export default function StatCard({ label, value, emoji }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        {emoji && <span>{emoji}</span>}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}