import { create } from 'zustand';
type State = { query: string; category: string; weekendOnly: boolean; setQuery: (query: string) => void; setCategory: (category: string) => void; setWeekendOnly: (value: boolean) => void; };
export const useEventStore = create<State>((set) => ({ query: '', category: '전체', weekendOnly: false, setQuery: (query) => set({ query }), setCategory: (category) => set({ category }), setWeekendOnly: (weekendOnly) => set({ weekendOnly }) }));
