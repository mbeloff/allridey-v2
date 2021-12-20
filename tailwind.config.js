const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,jsx,vue}'
  ],
  theme: {
    extend: {
      transitionProperty: {
        'spacing': 'margin, padding',
       },
       screens: {
        'print': {'raw': 'print'},
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      blue: colors.sky,
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
}
