import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-400 text-slate-950 shadow-cyan-400/20 hover:bg-cyan-300',
  secondary: 'border border-white/10 bg-white/[0.06] text-slate-100 hover:bg-white/[0.1]',
  ghost: 'text-slate-300 hover:bg-white/[0.07] hover:text-white',
  danger: 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-400',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 gap-2 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  icon: 'h-10 w-10 p-0',
};

export function Button({ className, variant = 'secondary', size = 'md', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg font-medium shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
