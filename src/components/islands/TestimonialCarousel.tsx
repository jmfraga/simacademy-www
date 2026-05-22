import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

interface Props {
  items: TestimonialItem[];
  autoplayMs?: number;
}

export default function TestimonialCarousel({
  items,
  autoplayMs = 6000,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    );
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || paused || reducedMotion || items.length < 2) return;
    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [emblaApi, paused, reducedMotion, autoplayMs, items.length]);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" aria-live="polite">
          {items.map((t, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] px-2 sm:px-6"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${items.length}`}
            >
              <figure className="max-w-2xl mx-auto text-center px-2 sm:px-6 py-6">
                <Quote
                  className="mx-auto mb-4 text-brand-purple/40"
                  size={36}
                  aria-hidden="true"
                />
                <blockquote className="font-display text-xl sm:text-2xl text-ink-900 leading-snug italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex flex-col items-center gap-2">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover border-2 border-brand-purple/30"
                    />
                  )}
                  <div className="font-semibold text-ink-900">{t.author}</div>
                  {t.role && (
                    <div className="text-sm text-ink-500">{t.role}</div>
                  )}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-surface border border-ink-300/50 shadow-sm text-ink-700 hover:text-brand-purple hover:border-brand-purple flex items-center justify-center transition-colors"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-surface border border-ink-300/50 shadow-sm text-ink-700 hover:text-brand-purple hover:border-brand-purple flex items-center justify-center transition-colors"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                aria-current={i === selectedIndex}
                className={`h-2 rounded-full transition-all ${
                  i === selectedIndex
                    ? 'w-8 bg-brand-purple'
                    : 'w-2 bg-ink-300 hover:bg-ink-500'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
