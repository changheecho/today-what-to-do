import { describe, expect, it } from 'vitest';
import { createIcs, createIcsFilename, escapeIcsText } from './ics';

const event = {
  id: 1,
  title: '우리 동네 영화제',
  date: '2026-09-05',
  time: '19:00–21:30',
  place: '햇살공원 야외무대',
};

describe('createIcs', () => {
  it('creates a standard calendar event with its title, times, and location', () => {
    const result = createIcs(event, new Date('2026-09-01T00:00:00.000Z'));

    expect(result).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n');
    expect(result).toContain('BEGIN:VEVENT\r\n');
    expect(result).toContain('DTSTAMP:20260901T000000Z\r\n');
    expect(result).toContain('DTSTART:20260905T190000\r\n');
    expect(result).toContain('DTEND:20260905T213000\r\n');
    expect(result).toContain('SUMMARY:우리 동네 영화제\r\n');
    expect(result).toContain('LOCATION:햇살공원 야외무대\r\n');
    expect(result).toMatch(/END:VEVENT\r\nEND:VCALENDAR\r\n$/);
  });

  it('escapes special ICS text characters', () => {
    expect(escapeIcsText('공원, 1층; 야외\\무대\n입구')).toBe('공원\\, 1층\\; 야외\\\\무대\\n입구');
  });

  it('makes a safe ASCII filename from the Korean event title', () => {
    const filename = createIcsFilename(event.title, event.id);

    expect(filename).toBe('uri-dongne-yeonghwaje.ics');
    expect(filename).toMatch(/^[a-z0-9-]+\.ics$/);
  });
});
