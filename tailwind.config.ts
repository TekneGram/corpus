import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'summer-sea-blue': {
          50: "#E6FCFE",
          100: "#CCF8FD",
          200: "#99F0FB",
          300: "#66E8F9",
          400: "#B1F0F7",
          500: "#00D7ED",
          600: "#00B6C9",
          700: "#0093A5",
          800: "#007282",
          900: "#004D5A",
        },
        'summer-sky-blue': {
          50: "#EBF6FB",
          100: "#CCE8F5",
          200: "#99D3EB",
          300: "#66BFE1",
          400: "#81BFDA",
          500: "#0096CA",
          600: "#007EB0",
          700: "#006692",
          800: "#004D75",
          900: "#003653",
        },
        'summer-sand': {
          50: "#FEFDF4",
          100: "#FBF9E6",
          200: "#F6F2CC",
          300: "#F2ECB3",
          400: "#F5F0CD",
          500: "#E5DC96",
          600: "#CAC16F",
          700: "#A29B58",
          800: "#7A7441",
          900: "#514C2B"
        },
        'summer-wet-sand': {
          50: "#FEF9E8",
          100: "#FDF1C6",
          200: "#FBE38D",
          300: "#F9D556",
          400: "#FADA7A",
          500: "#E0B928",
          600: "#C19910",
          700: "#98770C",
          800: "#725809",
          900: "#4B3905"
        }
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        quattrocento: ["Quattrocento", "serif"],
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3.125rem',
        '6xl': '3.75rem',
        '7xl': '4.375rem',
        '8xl': '5.625rem',
        '9xl': '7.5rem',
        '10xl': '10rem',
      }
    },
  },
  plugins: [],
}
export default config
