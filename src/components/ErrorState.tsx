interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/80 p-6 text-center">
      <p className="text-base text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-11 rounded-full bg-sage px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
