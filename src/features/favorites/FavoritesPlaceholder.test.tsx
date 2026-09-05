import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesPlaceholder } from './FavoritesPlaceholder';

const STORAGE_KEY = 'today-what-to-do:favorites';

describe('FavoritesPlaceholder', () => {
  beforeEach(() => localStorage.clear());

  it('adds and removes an event from favorites', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FavoritesPlaceholder eventId={7} onToggle={onToggle} />);

    const button = screen.getByRole('button', { name: '즐겨찾기 추가' });
    expect(button.getAttribute('aria-pressed')).toBe('false');

    await user.click(button);
    expect(
      screen.getByRole('button', { name: '즐겨찾기 해제' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[7]');

    await user.click(button);
    expect(
      screen.getByRole('button', { name: '즐겨찾기 추가' }).getAttribute('aria-pressed'),
    ).toBe('false');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenCalledWith(7);
  });

  it('restores a saved favorite after remounting', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([3]));

    const { unmount } = render(<FavoritesPlaceholder eventId={3} />);
    expect(
      screen.getByRole('button', { name: '즐겨찾기 해제' }).getAttribute('aria-pressed'),
    ).toBe('true');

    unmount();
    render(<FavoritesPlaceholder eventId={3} />);
    expect(screen.getByText('★')).toBeTruthy();
  });
});
