import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Component() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">A compact settings screen to round out the shell.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Dark mode is the default visual system for this app.</CardDescription>
          </div>
          <Badge tone="cyan">Enabled</Badge>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary">Save changes</Button>
          <Button variant="ghost">Reset</Button>
        </div>
      </Card>
    </div>
  );
}
