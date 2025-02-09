---
title: Transactions
sidebar_custom_props:
  sidebarActionTitle: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transactions

## TransactGet

DynamoDB-Toolbox exposes the [`GetTransaction`](../10-transact-get/index.md) actions to perform [TransactGetItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html).

## TransactWrite

DynamoDB-Toolbox exposes the following actions to perform [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

- [`PutTransaction`](../11-transact-put/index.md): Builds a transaction to put an entity item
- [`UpdateTransaction`](../7-batch-put/index.md): Builds a transaction to update an entity item
- [`DeleteTransaction`](../8-batch-delete/index.md): Builds a transaction to delete an entity item
- [`ConditionCheck`](../8-batch-delete/index.md): Builds a condition to check against an entity item for the transaction to succeed

TransactWriteItems operations can affect **multiple items**, so transactions do not have a `.send(...)` method. Instead, they should be performed via the dedicated `execute` function:

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'

const put = PokemonEntity.build(PutTransaction).item(...)
const update = PokemonEntity.build(UpdateTransaction).item(...)
const del = PokemonEntity.build(DeleteTransaction).key(...)
const check = PokemonEntity.build(ConditionCheck).key(...).condition(...)

await execute(put, update, del, check, ...otherTransactions)
```

:::caution

Only **one transaction per item** is supported. For instance, you cannot run a `ConditionCheck` and an `UpdateTransaction` on the same item: You can, however, condition the `UpdateTransaction` itself.

:::

### Options

The `execute` function accepts an additional object as a first argument for **operation-level** options:

```ts
await execute(options, ...writeTransactions)
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option               |       Type       | Default  | Description                                                                                                                                                                              |
| -------------------- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capacity`           | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |
| `metrics`            | `MetricsOption`  | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                             |
| `clientRequestToken` |     `string`     |    -     | Providing a `clientRequestToken` makes the execution idempotent, meaning that multiple identical calls have the same effect as one single call.                                          |
| `documentClient`     | `DocumentClient` |    -     | By default, the `documentClient` attached to the `Table` of the first `BatchWriteCommand` is used to execute the operation.<br/><br/>Use this option to override this behavior.          |

:::noteExamples

<Tabs>
<TabItem value="capacity" label="Capacity">

```ts
const { ConsumedCapacity } = await execute(
  { capacity: 'TOTAL' },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="metrics" label="Metrics">

```ts
const { ItemCollectionMetrics } = await execute(
  { metrics: 'SIZE' },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="client-request-token" label="Client request token">

```ts
await execute(
  { clientRequestToken: '123' },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="document-client" label="Document client">

```ts
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const documentClient = new DynamoDBDocumentClient(...)

await execute(
  { documentClient },
  ...batchWriteCommands
)
```

</TabItem>
</Tabs>

:::

### Response

The data is returned with the same response syntax as the [DynamoDB TransactWriteItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_ResponseSyntax).
