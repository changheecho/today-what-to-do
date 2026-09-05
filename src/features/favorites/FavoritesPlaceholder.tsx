export type FavoritesProps = { eventId: number; isFavorite?: boolean; onToggle?: (eventId: number) => void };
export function FavoritesPlaceholder({ eventId }: FavoritesProps) { return <button className="placeholder" aria-label={`즐겨찾기 ${eventId}`}>♡</button>; }
