export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
}

const ICS_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function formatLocalDateTime(date: string, time: string): string {
  const match = `${date}T${time}`.match(ICS_DATE_TIME);
  if (!match) throw new Error(`Invalid event date or time: ${date} ${time}`);
  return `${match[1]}${match[2]}${match[3]}T${match[4]}${match[5]}00`;
}

function formatUtcDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/([,;])/g, '\\$1');
}

export function createIcs(event: CalendarEvent, createdAt = new Date()): string {
  const [startTime, endTime] = event.time.split(/\s*[–—-]\s*/);
  if (!startTime || !endTime) throw new Error(`Invalid event time range: ${event.time}`);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Today What To Do//Calendar Event//KO',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:event-${event.id}@today-what-to-do.local`,
    `DTSTAMP:${formatUtcDateTime(createdAt)}`,
    `DTSTART:${formatLocalDateTime(event.date, startTime)}`,
    `DTEND:${formatLocalDateTime(event.date, endTime)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.place)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `${lines.join('\r\n')}\r\n`;
}

const INITIALS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const FINALS = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 'h'];

function romanizeHangul(character: string): string {
  const code = character.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return character;
  const initial = Math.floor(code / 588);
  const vowel = Math.floor((code % 588) / 28);
  const final = code % 28;
  return INITIALS[initial] + VOWELS[vowel] + FINALS[final];
}

export function createIcsFilename(title: string, eventId: number): string {
  const romanized = [...title].map(romanizeHangul).join('');
  const safeTitle = romanized
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${safeTitle || `event-${eventId}`}.ics`;
}
