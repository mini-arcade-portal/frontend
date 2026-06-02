/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ink = main background
        ink: {
          DEFAULT: '#1a1d3a',
          2: '#252a52',
        },
        // cream = card surface on dark
        cream: {
          DEFAULT: '#fef6e4',
          soft: '#fff9ec',
        },
        // accent palette
        pink: {
          DEFAULT: '#ff8fab',
          deep: '#ff5d8f',
        },
        mint: {
          DEFAULT: '#7be0ad',
          deep: '#3fc28a',
        },
        mustard: {
          DEFAULT: '#ffc857',
          deep: '#f5a623',
        },
        sky: {
          DEFAULT: '#6bb6ff',
          deep: '#3d8bfd',
        },
        coral: '#ff7a5c',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        hard: '0 6px 0 rgba(26, 29, 58, 0.9)',
        'hard-sm': '0 3px 0 rgba(26, 29, 58, 0.9)',
        'hard-lg': '0 10px 0 rgba(26, 29, 58, 0.9)',
      },
      backgroundImage: {
        // dotted pattern
        dots: 'radial-gradient(circle, rgba(254, 246, 228, 0.06) 1px, transparent 1px)',
      },
      animation: {
        pop: 'pop 0.4s cubic-bezier(.34,1.56,.64,1)',
        pulse: 'pulse 1.2s ease-in-out infinite',
      },
      keyframes: {
        pop: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
}
