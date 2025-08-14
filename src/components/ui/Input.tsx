// components/ui/Input.tsx
import { cn } from '@/lib/utils';

type InputProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  id,
  label,
  error,
  required = false,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-semibold text-black">
        {label}
        {required && (
          <span className="text-red-600" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        className={cn(
          'w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium placeholder-gray-600 shadow-[3px_3px_0_0_black]',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-[44px]', // WCAG minimum touch target size
          error && 'border-red-600 ring-2 ring-red-600 ring-offset-2 ring-offset-white',
          className
        )}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}
