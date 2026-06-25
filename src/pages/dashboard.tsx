import { Activity, ArrowUpRight, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const stats = [
  { label: 'Active workflows', value: '18', delta: '+12%' },
  { label: 'Open reviews', value: '7', delta: '+3' },
  { label: 'Deploy health', value: '99.8%', delta: 'Stable' },
];

export function Component() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="cyan">Dark-mode shell</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white">Workspace overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A polished foundation for a focused product interface.</p>
        </div>
        <Button variant="primary">
          New workflow
          <ArrowUpRight size={17} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <Badge tone="emerald">{stat.delta}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Operations timeline</CardTitle>
              <CardDescription>Recent system activity prepared for real data.</CardDescription>
            </div>
            <Badge tone="violet">Live</Badge>
          </CardHeader>
          <div className="space-y-3">
            {['Design system initialized', 'Router shell connected', 'Responsive navigation ready'].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.06] text-cyan-200">
                  {index === 0 ? <Activity size={17} /> : index === 1 ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item}</p>
                  <p className="text-xs text-slate-500">Ready for implementation detail</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Interface status</CardTitle>
              <CardDescription>Reusable primitives are available.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Buttons</span><span className="text-cyan-200">Ready</span></div>
            <div className="flex justify-between"><span>Cards</span><span className="text-cyan-200">Ready</span></div>
            <div className="flex justify-between"><span>Badges</span><span className="text-cyan-200">Ready</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
