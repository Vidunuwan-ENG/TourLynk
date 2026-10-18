import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tourlynk: {
          dark: '#07181D',
          navy: '#0B252C',
          teal: '#0B3B3C',
          deepTeal: '#0E4D52',
          lightTeal: '#135E63',
          accentTeal: '#26C6DA',
          gold: '#F5B041',
          goldHover: '#E5A93C',
          goldDark: '#D99419',
          goldLight: '#FEF9E7',
          grayBg: '#F8FAFB',
          grayCard: '#FFFFFF',
          grayBorder: '#E2E8F0',
          textDark: '#0F172A',
          textMuted: '#64748B',
          availableGreen: '#10B981',
          bookedRed: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 37, 44, 0.08), 0 2px 6px -1px rgba(11, 37, 44, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(11, 37, 44, 0.12), 0 4px 10px -2px rgba(11, 37, 44, 0.06)',
        'glow-gold': '0 0 15px rgba(245, 176, 65, 0.4)',
      }
    },
  },
  plugins: [],
} satisfies Config;

