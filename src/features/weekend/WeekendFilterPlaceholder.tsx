export type WeekendFilterProps = { enabled: boolean; onChange: (enabled: boolean) => void };
export function WeekendFilterPlaceholder({ enabled, onChange }: WeekendFilterProps) { return <button className={`filter-chip ${enabled ? 'active' : ''}`} onClick={() => onChange(!enabled)}>이번 주말</button>; }
