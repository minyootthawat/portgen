export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl skeleton mx-auto mb-4" />
        <div className="space-y-2 w-36 mx-auto">
          <div className="h-3 skeleton rounded" />
          <div className="h-3 skeleton rounded w-2/3 mx-auto" />
        </div>
        <p className="text-stone-400 dark:text-stone-500 text-sm mt-4">Loading your portfolio builder...</p>
      </div>
    </div>
  )
}
