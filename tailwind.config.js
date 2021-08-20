const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './index.html',
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'spacing': 'margin, padding',
       }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.blueGray,
      blue: colors.lightBlue,
      green: colors.emerald,
      red: colors.rose,
      yellow: colors.amber,
      orange: colors.orange
    }
  },
  variants: {
    extend: {
      scale: ['active', 'group-hover'],
      translate: ['group-hover'],
      borderRadius: ['first', 'last'],
      padding: ['hover']
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
