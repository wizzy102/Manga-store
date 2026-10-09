export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-12'
  return (
    <div className={`inline-flex items-center border border-line ${h}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${w} h-full text-lg text-bone transition hover:bg-char disabled:opacity-30`}
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${w} h-full text-lg text-bone transition hover:bg-char disabled:opacity-30`}
      >
        +
      </button>
    </div>
  )
}
