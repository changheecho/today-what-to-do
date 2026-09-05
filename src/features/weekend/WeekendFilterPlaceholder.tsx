import { addDays, format, parseISO, startOfDay, subDays } from 'date-fns';

type DateBearingEvent = { date: string };

export type WeekendFilterProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export type WeekendRange = {
  saturday: Date;
  sunday: Date;
};

/** Returns the weekend containing today, or the next weekend on weekdays. */
export function getNearestWeekend(today: Date = new Date()): WeekendRange {
  const currentDay = startOfDay(today);
  const dayOfWeek = currentDay.getDay();

  if (dayOfWeek === 0) {
    return { saturday: subDays(currentDay, 1), sunday: currentDay };
  }

  const saturday = addDays(currentDay, (6 - dayOfWeek) % 7);
  return { saturday, sunday: addDays(saturday, 1) };
}

export function filterForNearestWeekend<T extends DateBearingEvent>(
  events: T[],
  today: Date = new Date(),
): T[] {
  const { saturday, sunday } = getNearestWeekend(today);
  const saturdayKey = format(saturday, 'yyyy-MM-dd');
  const sundayKey = format(sunday, 'yyyy-MM-dd');

  return events.filter(({ date }) => {
    const eventKey = format(parseISO(date), 'yyyy-MM-dd');
    return eventKey === saturdayKey || eventKey === sundayKey;
  });
}

export function WeekendFilterPlaceholder({ enabled, onChange }: WeekendFilterProps) {
  return (
    <button
      type="button"
      className={`filter-chip ${enabled ? 'active' : ''}`}
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
    >
      이번 주말만 보기
    </button>
  );
}

export function WeekendEmptyState() {
  return <div className="empty">이번 주말에는 예정된 행사가 없어요. 전체 목록에서 다른 행사를 둘러보세요.</div>;
}
