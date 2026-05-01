export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-amber-200" />
        <p className="text-sm text-zinc-400">Memuat panel admin...</p>
      </div>
    </div>
  );
}
