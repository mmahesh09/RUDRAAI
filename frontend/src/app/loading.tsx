export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF6B00] border-t-transparent animate-spin" />
        <p className="text-sm text-[#71717A] font-body">Loading…</p>
      </div>
    </div>
  );
}
