import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-[12px] border-[1.5px] bg-neutral-50 px-4 text-base text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-neutral-200 focus:border-brand-500',
        className,
      )}
      {...props}
    />
  );
});
