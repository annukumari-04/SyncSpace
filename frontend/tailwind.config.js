/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        border: 'var(--border-color)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        surfaceItem: 'var(--surface-item)',
        surfaceItemHover: 'var(--surface-item-hover)'
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L0 0 0 30' fill='none' stroke='var(--border-color)' stroke-width='1'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
