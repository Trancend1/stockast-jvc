import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'block w-full rounded-[12px] border-[1.5px] bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-neutral-200 focus:border-brand-500',
        className,
      )}
      {...props}
    />
  );
});
