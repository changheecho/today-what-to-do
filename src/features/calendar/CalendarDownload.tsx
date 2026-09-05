import type { CalendarEvent } from './ics';
import { createIcs, createIcsFilename } from './ics';

export interface CalendarDownloadProps {
  event: CalendarEvent;
  onDownload?: (eventId: number) => void;
}

export function CalendarDownload({ event, onDownload }: CalendarDownloadProps) {
  const download = () => {
    const blob = new Blob([createIcs(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = createIcsFilename(event.title, event.id);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    onDownload?.(event.id);
  };

  return (
    <button className="ics-placeholder" type="button" onClick={download}>
      캘린더에 추가
    </button>
  );
}
