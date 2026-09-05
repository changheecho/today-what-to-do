export type IcsDownloadProps = { event: { id: number }; onDownload?: (eventId: number) => void };
export function IcsDownloadPlaceholder({ event }: IcsDownloadProps) { return <button className="ics-placeholder" aria-label={`캘린더에 ${event.id} 추가`}>캘린더 추가</button>; }
