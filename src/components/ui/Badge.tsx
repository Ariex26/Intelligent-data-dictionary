import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    {
                        'border-transparent bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
                        'border-transparent bg-neutral-800 text-neutral-50 hover:bg-neutral-700': variant === 'secondary',
                        'text-neutral-50': variant === 'outline',
                        'border-transparent bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
                        'border-transparent bg-green-600 text-white hover:bg-green-700': variant === 'success',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";
