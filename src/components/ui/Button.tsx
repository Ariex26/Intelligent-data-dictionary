import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
                        'bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-500': variant === 'secondary',
                        'border border-neutral-700 text-neutral-300 hover:bg-neutral-800 focus:ring-neutral-500': variant === 'outline',
                        'text-neutral-400 hover:text-white hover:bg-neutral-800': variant === 'ghost',
                        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-sm': size === 'md',
                        'px-6 py-3 text-base': size === 'lg',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
