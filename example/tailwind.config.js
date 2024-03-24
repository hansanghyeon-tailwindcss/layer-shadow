import hyeon from '@hyeon/tailwindcss-layer-shadow'
import mac from '@hyeon/mac-scrollbar'
import typo from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#242424',
        },
        light: {
          primary: '#ffffff',
        }
      }
    },
  },
  plugins: [
    hyeon,
    mac,
    typo
  ],
}

