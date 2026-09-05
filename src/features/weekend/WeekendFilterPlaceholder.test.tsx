import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  filterForNearestWeekend,
  getNearestWeekend,
  WeekendEmptyState,
  WeekendFilterPlaceholder,
} from './WeekendFilterPlaceholder';

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

describe('getNearestWeekend', () => {
  it.each([
    ['금요일에는 다음 날부터', new Date(2026, 8, 4), '2026-09-05', '2026-09-06'],
    ['토요일에는 오늘부터', new Date(2026, 8, 5), '2026-09-05', '2026-09-06'],
    ['일요일에는 전날부터', new Date(2026, 8, 6), '2026-09-05', '2026-09-06'],
    ['연말에도 다음 해로 이어지는', new Date(2026, 11, 31), '2027-01-02', '2027-01-03'],
  ])('%s 주말 경계를 반환한다', (_, today, saturday, sunday) => {
    const range = getNearestWeekend(today);

    expect(dateKey(range.saturday)).toBe(saturday);
    expect(dateKey(range.sunday)).toBe(sunday);
  });
});

describe('filterForNearestWeekend', () => {
  it('가장 가까운 토요일과 일요일 행사만 남긴다', () => {
    const events = [
      { id: 1, date: '2026-09-04' },
      { id: 2, date: '2026-09-05' },
      { id: 3, date: '2026-09-06' },
      { id: 4, date: '2026-09-12' },
    ];

    expect(filterForNearestWeekend(events, new Date(2026, 8, 4))).toEqual([events[1], events[2]]);
  });
});

describe('WeekendFilterPlaceholder', () => {
  it('토글 상태를 알리고 반대 상태로 변경한다', () => {
    const onChange = vi.fn();
    render(<WeekendFilterPlaceholder enabled={false} onChange={onChange} />);

    const toggle = screen.getByRole('button', { name: '이번 주말만 보기' });
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('주말 결과가 없을 때 안내를 보여준다', () => {
    render(<WeekendEmptyState />);

    expect(screen.getByText(/이번 주말에는 예정된 행사가 없어요/)).toBeTruthy();
  });
});
