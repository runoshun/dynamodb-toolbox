import type {
  Attribute,
  PrimitiveAttribute,
  PrimitiveAttributeType
} from 'v1/schema/attributes/index.js'

const primitiveAttributeTypeSet = new Set<PrimitiveAttributeType>([
  'boolean',
  'number',
  'string',
  'binary'
])

export const isPrimitiveAttribute = (attribute: Attribute): attribute is PrimitiveAttribute =>
  primitiveAttributeTypeSet.has(attribute.type as PrimitiveAttributeType)
