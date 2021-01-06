/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface Style {
  top?: string
  left?: string
  width?: string
  height?: string
  transform?: string
}

export default function getStyle(style: Style, filter: Array<any> = []) {
  const noNeedUnit = [
    'color',
    'backgroundColor',
    'textAlign',
    'opacity',
    'lineHeight',
    'fontWeight',
    'borderColor'
  ]
  const result: Style = {}
  Object.keys(style).forEach(key => {
    if (!filter.includes(key)) {
      if (key != 'rotate') {
        result[key] = style[key]

        if (!noNeedUnit.includes(key)) {
          result[key] += 'px'
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}
