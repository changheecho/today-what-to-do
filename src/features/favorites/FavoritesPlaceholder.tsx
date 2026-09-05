import { useState } from 'react';

export type FavoritesProps = {
  eventId: number;
  isFavorite?: boolean;
  onToggle?: (eventId: number) => void;
};

const STORAGE_KEY = 'today-what-to-do:favorites';

function readFavorites(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === 'number')
      : [];
  } catch {
    return [];
  }
}

function saveFavorite(eventId: number, shouldAdd: boolean) {
  const favorites = new Set(readFavorites());
  if (shouldAdd) favorites.add(eventId);
  else favorites.delete(eventId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    // The control still works for this session when storage is unavailable.
  }
}

export function FavoritesPlaceholder({ eventId, isFavorite, onToggle }: FavoritesProps) {
  const [savedFavorite, setSavedFavorite] = useState(() => readFavorites().includes(eventId));
  const favorite = isFavorite ?? savedFavorite;

  function toggleFavorite() {
    const nextFavorite = !favorite;
    if (isFavorite === undefined) setSavedFavorite(nextFavorite);
    saveFavorite(eventId, nextFavorite);
    onToggle?.(eventId);
  }

  return (
    <button
      type="button"
      className="placeholder"
      aria-label={favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      aria-pressed={favorite}
      onClick={toggleFavorite}
    >
      <span aria-hidden="true">{favorite ? '★' : '☆'}</span>
    </button>
  );
}
