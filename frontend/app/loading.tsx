export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-300" />
        <p className="text-sm text-zinc-400">Memuat halaman...</p>
      </div>
    </div>
  );
}
