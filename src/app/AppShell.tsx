import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';

export function AppShell() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <TopBar />
      <main className="min-h-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
