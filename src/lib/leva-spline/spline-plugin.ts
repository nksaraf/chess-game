import v8n from 'v8n.ts'
import { Colord, colord, extend, getFormat } from 'colord'
import namesPlugin from 'colord/plugins/names'
import type { InternalColorSettings, Format, ColorInput, SplineInput, SplineInternalPoint } from './spline-types'

extend([namesPlugin])

const omit = (obj: any, keys: string[]) => {
  const result: any = {}
  for (const key of Object.keys(obj)) {
    if (keys.indexOf(key) === -1) {
      result[key] = obj[key]
    }
  }
  return result
}

const convertMap = {
  rgb: 'toRgb',
  hsl: 'toHsl',
  hsv: 'toHsv',
  hex: 'toHex',
}

v8n.extend({
  color: () => (value: any) => colord(value).isValid(),
  splinePoint: () => ((value: any) => {
    console.log(value);
    return colord(value[0]).isValid() && v8n().number().test(value[1])
  })
})

export const schema = (o: any) => v8n().array().every.array().every.splinePoint()

export function convert(color: Colord, { format, hasAlpha, isString }: InternalColorSettings) {
  const convertFn = convertMap[format] + (isString && format !== 'hex' ? 'String' : '')
  // @ts-ignore
  const result = color[convertFn]()
  return typeof result === 'object' && !hasAlpha ? omit(result, ['a']) : result
}

export const sanitizeColor = (v: string, settings: InternalColorSettings) => {
  const color = colord(v)
  if (!color.isValid()) throw Error('Invalid color')
  return convert(color, settings)
}

export const format = (v: SplineInternalPoint[], settings: InternalColorSettings) => {
  return v.map(([a, b]) => [convert(colord(a.value), { ...a.settings, isString: true, format: 'hex' }), b])
}

export const normalize = ({ value }: SplineInput) => {
  console.log(value);
  let settings;
  let normed = value.map(([v, i]) => {
    const _f = getFormat(v)
    const format = (_f === 'name' ? 'hex' : _f) as Format
    const hasAlpha =
      typeof value === 'object'
        ? 'a' in value
        : (_f === 'hex' && v.length === 8) || /^(rgba)|(hsla)|(hsva)/.test(v)
    settings = { format, hasAlpha, isString: typeof value === 'string' }

    // by santizing the value we make sure the returned value is parsed and fixed,
    // consistent with future updates.
    return [{ value: sanitizeColor(v, settings), settings }, i] as const
  }).sort((a, b) => a[1] - b[1])


  return { value: normed, settings }
}

export const sanitize = (v: SplineInternalPoint[], settings: InternalColorSettings) => {
  return v.sort((a, b) => a[1] - b[1])
};
