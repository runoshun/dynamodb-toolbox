import { isArray } from './isArray.js'
import { isSet } from './isSet.js'

export const isObject = (candidate: unknown): candidate is Record<string, unknown> =>
  typeof candidate === 'object' && candidate !== null && !isArray(candidate) && !isSet(candidate)
