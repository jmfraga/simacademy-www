import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function StatCounter({
  value,
  suffix = '',
  label,
  duration = 2000,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReduced) {
      setDisplay(value);
      setStarted(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(elapsed / duration, 1);
              const eased = easeOutQuart(t);
              setDisplay(Math.round(value * eased));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, started]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-purple tabular-nums"
        aria-label={`${value}${suffix} ${label}`}
      >
        {display.toLocaleString('es-MX')}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-ink-700 font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}
