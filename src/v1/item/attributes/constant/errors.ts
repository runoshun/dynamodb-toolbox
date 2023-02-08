import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type { ResolvedAttribute } from '../types'

type InvalidConstantAttributeDefaultValueErrorBlueprint = ErrorBlueprint<{
  code: 'invalidConstantAttributeDefaultValue'
  hasPath: true
  payload: { expectedValue: ResolvedAttribute; defaultValue: unknown }
}>

export type ConstantAttributeErrorBlueprints = InvalidConstantAttributeDefaultValueErrorBlueprint
