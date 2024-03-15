const plugin = require("tailwindcss/plugin")

module.exports = plugin(({ addUtilities, theme }) => {
  const newUtilities = {}
  const p = {
    top: {
      top: '0',
      height: '15px',
      backgroundPosition: '180deg',
    },
    bottom: {
      bottom: '0',
      height: '15px',
      backgroundPosition: '0deg',
    },
    left: {
      left: '0',
      width: '15px',
      backgroundPosition: '90deg',
    },
    right: {
      right: '0',
      width: '15px',
      backgroundPosition: '-90deg',
    },
  }
  const directions = {
    t: {
      before: p.top,
    },
    b: {
      before: p.bottom,
    },
    l: {
      before: p.left,
    },
    r: {
      before: p.right,
    },
    x: {
      before: p.left,
      after: p.right,
    },
    y: {
      before: p.top,
      after: p.bottom,
    },
  }
  const colorScale = theme('colors')

  Object.keys(directions).forEach((direction) => {
    Object.keys(colorScale).forEach((colorName) => {
      const colorValues = colorScale[colorName]
      if (typeof colorValues === 'object' && colorValues !== null) {
        Object.keys(colorValues).forEach((shade) => {
          const rgbValue = colorValues[shade]
            .replace('#', '')
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .join(', ')
          const className = `.layer-shadow-${direction}-${colorName}-${shade}`
          const directionStyles = directions[direction]

          const before = directionStyles.before
            ? {
                ['&::before']: {
                  content: "''",
                  display: 'block',
                  position: 'absolute',
                  width: '100%',
                  left: '0',
                  zIndex: '10',
                  ...directionStyles.before,
                  background: `linear-gradient(${directionStyles.before.backgroundPosition}, rgba(${rgbValue}, 1) 0%, rgba(${rgbValue}, 0) 100%)`,
                },
              }
            : {}
          const after = directionStyles.after
            ? {
                ['&::after']: {
                  content: "''",
                  display: 'block',
                  position: 'absolute',
                  width: '100%',
                  left: '0',
                  zIndex: '10',
                  ...directionStyles.after,
                  background: `linear-gradient(${directionStyles.after.backgroundPosition}, rgba(${rgbValue}, 1) 0%, rgba(${rgbValue}, 0) 100%)`,
                },
              }
            : {}
          newUtilities[className] = {
            ...after,
            ...before,
          }
        })
      }
    })
  })

  addUtilities(newUtilities, ['responsive', 'hover'])
}, {})