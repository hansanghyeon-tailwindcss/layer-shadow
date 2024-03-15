import { pipe, flow } from 'fp-ts/function'
import * as R from 'fp-ts/Record'
import * as A from 'fp-ts/Array'
import plugin from 'tailwindcss/plugin'

// Function to convert a hex string (with or without a leading '#') to an RGB string
const hexStringToRgb = (hex: string): string =>
  pipe(
    hex,
    s => s.replace('#', ''), // Remove '#' character
    s => {
      const match = s.match(/.{1,2}/g);
      return match ? match : [];
    },             // Split into array of strings, each of 2 characters
    A.map(s => parseInt(s, 16)), // Convert each string in the array to an integer base 16
    A.map(n => n.toString()),    // Convert each number to string to use join
    numbers => numbers.join(', ') // Join the string representations of the numbers with ', '
  );

export default plugin(({ addUtilities, theme }) => {
  const newUtilities: {
    [key: string]: {
      [key: string]: {
        [key: string]: string
      }
    }
  } = {}
  const p = {
    top: {
      top: '0',
      height: '15px',
      backgroundPosition: '180deg',
    },
    bottom: {
      bottom: '0',
      height: '30px',
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
      after: null,
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

  if (colorScale === undefined) {
    return
  }
  colorScale.
  pipe(
    directions,
    R.mapWithIndex((directionName, direactionValue: {
      before?: {
        [key: string]: {
          [key: string]: string
        }
      }
      after?: {
        [key: string]: {
          [key: string]: string
        }
      }
    }) => pipe(
      colorScale,
      R.mapWithIndex((colorName, colorValue: { [key: string ]: string } | string | null) => {
        if (typeof colorValue === 'object' && colorValue !== null) {
          pipe(
            colorValue,
            R.mapWithIndex((shade, value) => {
              const rgbValue = pipe(
                value,
                hexStringToRgb
              )
              const className = `.layer-shadow-${directionName}-${colorName}-${shade}`
              const directionStyles = direactionValue

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
                : undefined
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
                : undefined
              newUtilities[className] = {
                ...after,
                ...before,
              }
            })
          )
        }
      })
    ))
  )

  addUtilities(newUtilities)
}, {})