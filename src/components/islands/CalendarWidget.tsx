import { useMemo, useState, useCallback, useRef, useEffect } from 'react';

export type CalendarEvent = {
  slug: string;
  title: string;
  shortTitle?: string;
  modality: 'online' | 'presencial' | 'hibrido';
  href: string;
  accent: 'purple' | 'green' | 'gold';
  startDate: string | null;
  endDate: string | null;
  datesLabel: string;
  price?: string;
  audience?: string;
  location?: string;
  avalFlasic?: string;
  coBranded?: string;
  confirmed: boolean;
};

interface Props {
  events: CalendarEvent[];
}

const MODALITY_LABEL: Record<CalendarEvent['modality'], string> = {
  online: 'En línea',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

const ACCENT_STRIP: Record<CalendarEvent['accent'], string> = {
  purple: 'bg-brand-purple',
  green: 'bg-brand-green',
  gold: 'bg-[var(--accent-gold)]',
};

const ACCENT_BG_SOFT: Record<CalendarEvent['accent'], string> = {
  purple: 'bg-brand-purple/10 text-brand-purple',
  green: 'bg-brand-green/10 text-brand-green',
  gold: 'bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]',
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const WEEKDAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const WEEKDAYS_LABEL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Mon=0 .. Sun=6
function dayOfWeekMonFirst(d: Date): number {
  return (d.getDay() + 6) % 7;
}

type View = 'list' | 'month';
type ModalityFilter = 'all' | CalendarEvent['modality'];
type LocationFilter = 'all' | 'online' | 'queretaro' | 'cdmx' | 'otra';
type YearFilter = 'all' | string;

function inferLocationKey(ev: CalendarEvent): LocationFilter {
  if (ev.modality === 'online') return 'online';
  const loc = (ev.location ?? '').toLowerCase();
  if (loc.includes('queretaro') || loc.includes('querétaro')) return 'queretaro';
  if (loc.includes('cdmx') || loc.includes('mexico') || loc.includes('méxico')) return 'cdmx';
  return 'otra';
}

export default function CalendarWidget({ events }: Props) {
  const [view, setView] = useState<View>('list');
  const [modality, setModality] = useState<ModalityFilter>('all');
  const [location, setLocation] = useState<LocationFilter>('all');
  const [year, setYear] = useState<YearFilter>('all');

  // Default focus month: first confirmed event's month, or current.
  const initialMonth = useMemo(() => {
    const first = events.find((e) => e.startDate);
    if (first?.startDate) {
      const d = parseISO(first.startDate);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [events]);

  const [cursor, setCursor] = useState(initialMonth);

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      if (e.startDate) set.add(e.startDate.slice(0, 4));
    }
    return Array.from(set).sort();
  }, [events]);

  const filteredAll = useMemo(() => {
    return events.filter((e) => {
      if (modality !== 'all' && e.modality !== modality) return false;
      if (location !== 'all' && inferLocationKey(e) !== location) return false;
      if (year !== 'all') {
        if (!e.startDate || !e.startDate.startsWith(year)) return false;
      }
      return true;
    });
  }, [events, modality, location, year]);

  const confirmedFiltered = useMemo(
    () => filteredAll.filter((e) => e.confirmed && e.startDate),
    [filteredAll]
  );

  const unconfirmedFiltered = useMemo(
    () => filteredAll.filter((e) => !e.confirmed),
    [filteredAll]
  );

  const clearFilters = useCallback(() => {
    setModality('all');
    setLocation('all');
    setYear('all');
  }, []);

  const hasActiveFilters = modality !== 'all' || location !== 'all' || year !== 'all';

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Tabs */}
        <div role="tablist" aria-label="Vista del calendario" className="inline-flex self-start rounded-full border border-ink-200 bg-white p-1 shadow-sm">
          <button
            role="tab"
            aria-selected={view === 'list'}
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              view === 'list' ? 'bg-brand-purple text-white' : 'text-ink-700 hover:text-brand-purple'
            }`}
          >
            Vista lista
          </button>
          <button
            role="tab"
            aria-selected={view === 'month'}
            onClick={() => setView('month')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              view === 'month' ? 'bg-brand-purple text-white' : 'text-ink-700 hover:text-brand-purple'
            }`}
          >
            Vista mensual
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-xs font-semibold text-ink-700">
            <span className="mb-1 uppercase tracking-wider">Modalidad</span>
            <select
              value={modality}
              onChange={(e) => setModality(e.target.value as ModalityFilter)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-normal text-ink-900 focus:border-brand-purple focus:outline-none"
            >
              <option value="all">Todas</option>
              <option value="online">En línea</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </label>

          <label className="flex flex-col text-xs font-semibold text-ink-700">
            <span className="mb-1 uppercase tracking-wider">Sede</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as LocationFilter)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-normal text-ink-900 focus:border-brand-purple focus:outline-none"
            >
              <option value="all">Todas</option>
              <option value="online">En línea</option>
              <option value="queretaro">Querétaro</option>
              <option value="cdmx">CDMX</option>
              <option value="otra">Otra</option>
            </select>
          </label>

          {years.length > 0 && (
            <label className="flex flex-col text-xs font-semibold text-ink-700">
              <span className="mb-1 uppercase tracking-wider">Año</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-normal text-ink-900 focus:border-brand-purple focus:outline-none"
              >
                <option value="all">Todos</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-end rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 hover:border-brand-purple hover:text-brand-purple transition"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <ListView confirmed={confirmedFiltered} unconfirmed={unconfirmedFiltered} />
      ) : (
        <MonthView
          events={confirmedFiltered}
          cursor={cursor}
          setCursor={setCursor}
        />
      )}
    </div>
  );
}

/* -------------------------- List view -------------------------- */

function ListView({
  confirmed,
  unconfirmed,
}: {
  confirmed: CalendarEvent[];
  unconfirmed: CalendarEvent[];
}) {
  return (
    <div className="space-y-10">
      <div>
        {confirmed.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-ink-700">
            No hay cohortes que coincidan con los filtros seleccionados.
          </p>
        ) : (
          <ul className="space-y-4">
            {confirmed.map((ev) => (
              <EventCard key={ev.slug} ev={ev} />
            ))}
          </ul>
        )}
      </div>

      {unconfirmed.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-900 mb-3">
            Cohortes en planeación
          </h3>
          <p className="text-sm text-ink-700 mb-4">
            Estos programas no tienen fecha confirmada todavía. Escríbenos para reservar lugar en la próxima cohorte.
          </p>
          <ul className="space-y-4">
            {unconfirmed.map((ev) => (
              <EventCard key={ev.slug} ev={ev} muted />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, muted = false }: { ev: CalendarEvent; muted?: boolean }) {
  return (
    <li>
      <a
        href={ev.href}
        className={`group flex overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          muted ? 'opacity-90' : ''
        }`}
      >
        <span className={`w-1.5 shrink-0 ${ACCENT_STRIP[ev.accent]}`} aria-hidden="true" />
        <div className="flex flex-1 flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${ACCENT_BG_SOFT[ev.accent]}`}>
                {MODALITY_LABEL[ev.modality]}
              </span>
              {ev.coBranded && (
                <span className="text-xs font-semibold text-ink-700">
                  con {ev.coBranded}
                </span>
              )}
              {ev.avalFlasic && (
                <span className="text-xs text-ink-700">Aval FLASIC {ev.avalFlasic}</span>
              )}
            </div>
            <h4 className="font-display text-lg font-semibold text-ink-900 group-hover:text-brand-purple transition">
              {ev.shortTitle ?? ev.title}
            </h4>
            <p className="text-sm text-ink-700 mt-1">
              <span className="font-medium">{ev.datesLabel}</span>
              {ev.location && <span> · {ev.location}</span>}
              {ev.price && <span> · {ev.price}</span>}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-brand-purple group-hover:underline">
            Ver curso →
          </span>
        </div>
      </a>
    </li>
  );
}

/* -------------------------- Month view -------------------------- */

interface MonthCursor { year: number; month: number; }

function MonthView({
  events,
  cursor,
  setCursor,
}: {
  events: CalendarEvent[];
  cursor: MonthCursor;
  setCursor: (c: MonthCursor) => void;
}) {
  const { year, month } = cursor;

  const prev = useCallback(() => {
    setCursor(month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  }, [year, month, setCursor]);

  const next = useCallback(() => {
    setCursor(month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });
  }, [year, month, setCursor]);

  // Build grid: 6 weeks × 7 days = 42 cells starting from Monday before/on day 1.
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = dayOfWeekMonFirst(firstOfMonth);
  const gridStart = new Date(year, month, 1 - startOffset);

  const cells = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) {
      arr.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
    }
    return arr;
  }, [gridStart]);

  // Map each cell ISO to events that overlap.
  const cellEvents = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const c of cells) {
      const iso = fmtISO(c);
      const matches = events.filter((ev) => {
        if (!ev.startDate || !ev.endDate) return false;
        return iso >= ev.startDate && iso <= ev.endDate;
      });
      if (matches.length) map.set(iso, matches);
    }
    return map;
  }, [cells, events]);

  // Count events touching this month for "empty" message.
  const eventsThisMonth = useMemo(() => {
    const monthStart = fmtISO(new Date(year, month, 1));
    const monthEnd = fmtISO(new Date(year, month + 1, 0));
    return events.filter(
      (ev) => ev.startDate && ev.endDate && !(ev.endDate < monthStart || ev.startDate > monthEnd)
    );
  }, [events, year, month]);

  // Keyboard navigation inside grid.
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [focusIdx, setFocusIdx] = useState<number>(startOffset);
  useEffect(() => { setFocusIdx(startOffset); }, [startOffset]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextIdx = focusIdx;
    switch (e.key) {
      case 'ArrowRight': nextIdx = Math.min(41, focusIdx + 1); break;
      case 'ArrowLeft':  nextIdx = Math.max(0, focusIdx - 1); break;
      case 'ArrowDown':  nextIdx = Math.min(41, focusIdx + 7); break;
      case 'ArrowUp':    nextIdx = Math.max(0, focusIdx - 7); break;
      default: return;
    }
    e.preventDefault();
    setFocusIdx(nextIdx);
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-cell="${nextIdx}"]`);
    el?.focus();
  }, [focusIdx]);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          aria-label="Mes anterior"
          className="rounded-full border border-ink-200 bg-white p-2 text-ink-700 hover:border-brand-purple hover:text-brand-purple transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="font-display text-2xl font-semibold text-ink-900">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          type="button"
          onClick={next}
          aria-label="Mes siguiente"
          className="rounded-full border border-ink-200 bg-white p-2 text-ink-700 hover:border-brand-purple hover:text-brand-purple transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {eventsThisMonth.length === 0 && (
        <p className="mb-4 rounded-lg bg-ink-50 p-4 text-center text-sm text-ink-700">
          Sin cursos en este mes — navega adelante o atrás para ver cohortes futuras.
        </p>
      )}

      {/* Mobile fallback: stacked list of events this month */}
      <div className="sm:hidden">
        {eventsThisMonth.length > 0 ? (
          <ul className="space-y-3">
            {eventsThisMonth.map((ev) => (
              <EventCard key={ev.slug} ev={ev} />
            ))}
          </ul>
        ) : null}
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-1 text-xs font-semibold uppercase tracking-wider text-ink-700">
          {WEEKDAYS_LABEL.map((d, i) => (
            <div key={d} className="px-2 py-2 text-center" aria-label={d}>
              <span className="hidden md:inline">{d.slice(0, 3)}</span>
              <span className="md:hidden">{WEEKDAYS_SHORT[i]}</span>
            </div>
          ))}
        </div>
        <div
          ref={gridRef}
          role="grid"
          aria-label={`Calendario de ${MONTH_NAMES[month]} ${year}`}
          onKeyDown={onKeyDown}
          className="grid grid-cols-7 gap-1"
        >
          {cells.map((d, idx) => {
            const isoStr = fmtISO(d);
            const inMonth = d.getMonth() === month;
            const evs = cellEvents.get(isoStr) ?? [];
            const isToday = isoStr === fmtISO(new Date());
            return (
              <div
                key={idx}
                data-cell={idx}
                role="gridcell"
                tabIndex={idx === focusIdx ? 0 : -1}
                aria-label={`${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}${evs.length ? `, ${evs.length} curso${evs.length > 1 ? 's' : ''}` : ''}`}
                className={`min-h-[80px] rounded-lg border p-1.5 outline-none focus:ring-2 focus:ring-brand-purple ${
                  inMonth ? 'border-ink-200 bg-white' : 'border-transparent bg-ink-50/50 text-ink-700/50'
                }`}
              >
                <div className={`mb-1 flex items-center justify-between text-xs font-semibold ${isToday ? 'text-brand-purple' : ''}`}>
                  <span>{d.getDate()}</span>
                </div>
                <div className="space-y-0.5">
                  {evs.slice(0, 3).map((ev) => {
                    const isStart = ev.startDate === isoStr;
                    const isEnd = ev.endDate === isoStr;
                    return (
                      <a
                        key={ev.slug}
                        href={ev.href}
                        title={`${ev.shortTitle ?? ev.title} · ${ev.datesLabel}`}
                        className={`block truncate px-1.5 py-0.5 text-[10px] font-semibold text-white ${ACCENT_STRIP[ev.accent]} ${
                          isStart ? 'rounded-l-md' : ''
                        } ${isEnd ? 'rounded-r-md' : ''} hover:opacity-90`}
                      >
                        {isStart ? (ev.shortTitle ?? ev.title) : '·'}
                      </a>
                    );
                  })}
                  {evs.length > 3 && (
                    <span className="block px-1.5 text-[10px] text-ink-700">+{evs.length - 3} más</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
