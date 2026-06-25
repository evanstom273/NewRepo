import { Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const projects = ['Design platform', 'Customer portal', 'Analytics console'];

export function Component() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Projects</h1>
          <p className="mt-2 text-sm text-slate-400">A quiet, scannable project surface for the shell.</p>
        </div>
        <Button variant="primary"><Plus size={17} />Add project</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={project}>
            <CardHeader>
              <div>
                <CardTitle>{project}</CardTitle>
                <CardDescription>Workspace module placeholder</CardDescription>
              </div>
              <Badge tone={index === 0 ? 'cyan' : index === 1 ? 'violet' : 'emerald'}>Active</Badge>
            </CardHeader>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${68 - index * 12}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
