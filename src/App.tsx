import { Bell, Command, FolderKanban, Home, Menu, Search, Settings, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20">
          <Command size={20} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">NewRepo</p>
          <p className="text-xs text-slate-400">Application shell</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
                isActive
                  ? 'bg-white text-slate-950 shadow-lg shadow-cyan-400/10'
                  : 'text-slate-400 hover:bg-white/[0.07] hover:text-white',
              )
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200">
          <Sparkles size={18} />
        </div>
        <p className="text-sm font-medium text-white">Ready for product work</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">A clean shell for dashboards, tools, and internal workflows.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34rem),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_30rem)]" />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/88 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/70" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
          <aside className="relative h-full w-[min(22rem,88vw)] border-r border-white/10 bg-slate-950 shadow-2xl">
            <div className="absolute right-3 top-3">
              <Button size="icon" variant="ghost" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
                <X size={19} />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="relative lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </Button>

            <div className="hidden h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-500 md:flex">
              <Search size={17} />
              <span>Search workspace</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button size="icon" variant="ghost" aria-label="Notifications">
                <Bell size={19} />
              </Button>
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-300 to-violet-400 p-px">
                <div className="grid h-full w-full place-items-center rounded-[7px] bg-slate-950 text-sm font-semibold text-white">E</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
