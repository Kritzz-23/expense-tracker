/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container": "#edeeef",
        "surface-dim": "#d9dadb",
        "on-secondary-fixed": "#001f26",
        "surface": "#f8f9fa",
        "secondary": "#00687a",
        "on-error-container": "#93000a",
        "error": "#ba1a1a",
        "outline": "#6c7a71",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#002113",
        "on-primary-container": "#00422b",
        "tertiary-fixed": "#ffdad7",
        "primary": "#006c49",
        "on-tertiary-fixed": "#410005",
        "background": "#f8f9fa",
        "on-background": "#191c1d",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e7e8e9",
        "outline-variant": "#bbcabf",
        "tertiary-fixed-dim": "#ffb3af",
        "secondary-fixed-dim": "#4cd7f6",
        "primary-fixed-dim": "#4edea3",
        "tertiary-container": "#fc7c78",
        "surface-tint": "#006c49",
        "secondary-fixed": "#acedff",
        "surface-bright": "#f8f9fa",
        "tertiary": "#a43a3a",
        "on-surface-variant": "#3c4a42",
        "on-secondary-fixed-variant": "#004e5c",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#842225",
        "surface-container-highest": "#e1e3e4",
        "secondary-container": "#57dffe",
        "on-tertiary-container": "#711419",
        "primary-fixed": "#6ffbbe",
        "surface-variant": "#e1e3e4",
        "error-container": "#ffdad6",
        "on-primary": "#ffffff",
        "on-surface": "#191c1d",
        "on-primary-fixed-variant": "#005236",
        "inverse-on-surface": "#f0f1f2",
        "inverse-primary": "#4edea3",
        "inverse-surface": "#2e3132",
        "on-secondary-container": "#006172",
        "surface-container-low": "#f3f4f5",
        "primary-container": "#10b981",
        "on-error": "#ffffff"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      }
    },
  },
  plugins: [],
}
