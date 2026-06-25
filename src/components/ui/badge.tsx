import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type BadgeTone = 'cyan' | 'violet' | 'emerald' | 'slate';

const tones: Record<BadgeTone, string> = {
  cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
  violet: 'border-violet-300/25 bg-violet-300/10 text-violet-200',
  emerald: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  slate: 'border-white/10 bg-white/[0.06] text-slate-300',
};

export function Badge({ className, tone = 'slate', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)}
      {...props}
    />
  );
}
