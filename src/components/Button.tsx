import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'mustard' | 'pink' | 'mint' | 'sky' | 'ink'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  mustard: 'bg-mustard text-ink',
  pink: 'bg-pink text-ink',
  mint: 'bg-mint text-ink',
  sky: 'bg-sky text-cream',
  ink: 'bg-ink text-cream',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'mustard',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          'border-[3px] border-ink font-bold font-sans',
          'shadow-hard-sm transition-transform duration-100',
          'hover:-translate-y-0.5 hover:shadow-hard',
          'active:translate-y-0 active:shadow-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
