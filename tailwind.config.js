const colors = {
  'sky-blue': {
    DEFAULT: '#075589',
    '50': '#7DC7F8',
    '100': '#55B6F6',
    '200': '#3C9FE2',
    '300': '#1688D4',
    '400': '#0973BA',
    '500': '#075589',
    '600': '#064570',
    '700': '#043352',
    '800': '#032A44',
    '900': '#021B2C'
  },
  balsa: {
    'DEFAULT': '#fffbf2',
    '50': '#ffffff',
    '100': '#fffdf9',
    '200': '#fffbf2',
    '300': '#ebe2ce',
    '400': '#d9cba9',
    '500': '#c8b482',
    '600': '#b99e5a',
    '700': '#a68935',
    '800': '#907014',
    '900': '#6c5200',
  }
}

const scale = {
  '2xs': '0.236rem',
  xs: '0.382rem',
  sm: '0.618rem',
  base: '1rem',
  md: '1.618rem',
  lg: '2.618rem',
  xl: '4.236rem'
}

module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: colors,
      spacing: scale,
      maxWidth: {
        'hero': '120ch',
        'content': '70ch'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      }
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
