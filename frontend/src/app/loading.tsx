export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-black flex items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2997FF] motion-safe:animate-pulse" aria-hidden="true" />
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA]">Loading</p>
      </div>
    </div>
  );
}
