export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-3xl border border-cream-dark bg-white/60 p-6">
      <div className="h-4 w-24 rounded bg-cream-dark" />
      <div className="space-y-2">
        <div className="h-5 w-full rounded bg-cream-dark" />
        <div className="h-5 w-11/12 rounded bg-cream-dark" />
        <div className="h-5 w-4/5 rounded bg-cream-dark" />
      </div>
      <div className="h-16 w-full rounded-2xl bg-cream-dark/80" />
      <div className="h-12 w-full rounded-2xl bg-cream-dark/80" />
    </div>
  )
}
