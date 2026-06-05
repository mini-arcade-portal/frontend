import { InputHTMLAttributes, forwardRef } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const fieldId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="block font-mono text-[11px] font-semibold tracking-widest uppercase mb-2 opacity-70"
        >
          {label}
        </label>
        <input
          id={fieldId}
          ref={ref}
          className={[
            'w-full bg-ink text-cream',
            'border-2 px-4 py-3.5 rounded-xl',
            'font-sans text-base font-medium',
            'transition-colors',
            error ? 'border-coral' : 'border-transparent',
            'focus:outline-none focus:border-mustard',
            className,
          ].join(' ')}
          {...rest}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-coral">{error}</p>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
