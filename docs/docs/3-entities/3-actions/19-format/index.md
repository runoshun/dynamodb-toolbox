---
title: Format
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EntityFormatter

Given a saved item, validates that it respects the schema of the `Entity` and formats it:

```ts
import { EntityFormatter } from 'dynamodb-toolbox/entity/actions/format'

const formattedPikachu =
  PokemonEntity.build(EntityFormatter).format(savedPikachu)
```

:::info

This action is mostly a **wrapper around the schema [`Formatter`](../../../4-schemas/14-actions/2-format.md) action**.

:::

Note that:

- Inputs are not mutated (additional and `hidden` fields are omitted)
- The formatting will throw an error if the saved item is invalid
- Transformations (i.e. `savedAs` and `transforms`) are applied in reverse

## Methods

### `format(...)`

<p style={{ marginTop: '-15px' }}><i><code>(savedItem: unknown, options?: FormattingOptions) => FormattedItem&lt;ENTITY&gt;</code></i></p>

Formats a saved item:

<!-- prettier-ignore -->
```ts
const formattedItem = PokemonEntity.build(EntityFormatter).format(savedItem)
```

You can provide **formatting options** as second argument. Available options are:

| Option       |       Type       | Default | Description                                                                                                                                                                                              |
| ------------ | :--------------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `partial`    |    `boolean`     | `false` | Allow every attribute (root or nested) to be optional while formatting.                                                                                                                                  |
| `attributes` | `Path<Entity>[]` |    -    | To specify a list of attributes to format (other attributes will be omitted).<br/><br/>See the [`PathParser`](../18-parse-paths/index.md#paths) action for more details on how to write attribute paths. |

:::noteExamples

<Tabs>
<TabItem value="partial" label="Partial">

```ts
const saved = {
  pokemonId: 'pikachu1',
  name: 'Pikachu'
}

// 🙌 Typed as `DeepPartial<Pokemon>`
const formatted = PokemonEntity.build(
  EntityFormatter
).format(saved, { partial: true })
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const saved = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  level: 42,
  ...
}

// 🙌 Typed as `Pick<Pokemon, 'name' | 'level'>`
const formatted = PokemonEntity.build(
  EntityFormatter
).format(saved, { attributes: ['name', 'level'] })
```

</TabItem>
</Tabs>

:::

You can use the `FormattedItem` type to explicitely type an object as a formatting output:

```ts
import type { FormattedItem } from 'dynamodb-toolbox/entity/actions/format'

const formattedItem: FormattedItem<
  typeof PokemonEntity,
  // 👇 Optional options
  { partial: false; attributes: 'name' | 'level' }
  // ❌ Throws a type error
> = { invalid: 'output' }
```
