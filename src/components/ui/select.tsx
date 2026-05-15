import * as React from 'react';
import { cn } from '@/lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-12 w-full rounded-[12px] border-[1.5px] bg-neutral-50 px-3 text-base text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-neutral-200 focus:border-brand-500',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237A6B55' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        paddingRight: '40px',
      }}
      {...props}
    >
      {children}
    </select>
  );
});
