/** AnnaRelay mark: a plate handed along an arc (the relay), paper on leaf green, with a turmeric plate. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1F7A4C" />
      <path d="M9 25.5a11 11 0 0 1 22 0" fill="none" stroke="#FBF6EE" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M27.5 21.2 31 25.6l-5.1.6" fill="none" stroke="#FBF6EE" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="28.5" width="24" height="3.2" rx="1.6" fill="#F2B544" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Logo className="size-7" />
      <span className="text-[17px] font-semibold tracking-tight text-ink">AnnaRelay</span>
    </span>
  );
}
