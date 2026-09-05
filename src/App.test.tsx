import { render, screen } from '@testing-library/react'; import { describe, expect, it } from 'vitest'; import App from './App';
describe('App',()=>{it('renders event board and sample events',()=>{render(<App/>); expect(screen.getByRole('heading',{name:'오늘 뭐 하지?'})).toBeTruthy(); expect(screen.getByText('우리 동네 영화제')).toBeTruthy(); expect(screen.getByText('이번 달 동네 행사')).toBeTruthy();});});
