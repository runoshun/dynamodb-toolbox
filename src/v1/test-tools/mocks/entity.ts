import type { EntityV2 } from 'v1/entity/index.js'
import type { KeyInput } from 'v1/entity/actions/parse.js'
import {
  GetItemCommand,
  GetItemOptions,
  GetItemResponse
} from 'v1/entity/actions/commands/getItem/index.js'
import type { GetItemCommandClass } from 'v1/entity/actions/commands/getItem/getItemCommand.js'
import {
  PutItemCommand,
  PutItemInput,
  PutItemOptions,
  PutItemResponse
} from 'v1/entity/actions/commands/putItem/index.js'
import type { PutItemCommandClass } from 'v1/entity/actions/commands/putItem/putItemCommand.js'
import {
  DeleteItemCommand,
  DeleteItemOptions,
  DeleteItemResponse
} from 'v1/entity/actions/commands/deleteItem/index.js'
import type { DeleteItemCommandClass } from 'v1/entity/actions/commands/deleteItem/deleteItemCommand.js'
import {
  UpdateItemCommand,
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/entity/actions/commands/updateItem/index.js'
import type { UpdateItemCommandClass } from 'v1/entity/actions/commands/updateItem/updateItemCommand.js'

import type { ActionClassMocker, ActionClassResults, ActionName } from './types.js'
import { GetItemCommandMock } from './getItemCommand.js'
import { PutItemCommandMock } from './putItemCommand.js'
import { DeleteItemCommandMock } from './deleteItemCommand.js'
import { UpdateItemCommandMock } from './updateItemCommand.js'
import { ActionMocker } from './actionMocker.js'
import { CommandResults } from './commandResults.js'
import { $originalEntity, $mockedImplementations, $receivedActions } from './constants.js'

export class MockedEntity<ENTITY extends EntityV2 = EntityV2> {
  [$originalEntity]: ENTITY;

  [$mockedImplementations]: Partial<{
    get: (input: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>) => GetItemResponse<ENTITY>
    put: (input: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>) => PutItemResponse<ENTITY>
    delete: (
      input: KeyInput<ENTITY>,
      options?: DeleteItemOptions<ENTITY>
    ) => DeleteItemResponse<ENTITY>
    update: (
      input: UpdateItemInput<ENTITY>,
      options?: UpdateItemOptions<ENTITY>
    ) => UpdateItemResponse<ENTITY>
  }>;
  [$receivedActions]: {
    get: [input?: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>][]
    put: [input?: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>][]
    delete: [input?: KeyInput<ENTITY>, options?: DeleteItemOptions<ENTITY>][]
    update: [input?: UpdateItemInput<ENTITY>, options?: UpdateItemOptions<ENTITY>][]
  }

  constructor(entity: ENTITY) {
    this[$originalEntity] = entity

    this[$mockedImplementations] = {}
    this[$receivedActions] = { get: [], put: [], delete: [], update: [] }

    entity.build = command => {
      switch (command) {
        // @ts-expect-error impossible to fix
        case GetItemCommand:
          return new GetItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case PutItemCommand:
          return new PutItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case DeleteItemCommand:
          return new DeleteItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case UpdateItemCommand:
          return new UpdateItemCommandMock(this) as any
        default:
          throw new Error(`Unable to mock entity command: ${String(command)}`)
      }
    }
  }

  reset(): void {
    this[$mockedImplementations] = {}
    this[$receivedActions] = { get: [], put: [], delete: [], update: [] }
  }

  on<
    ACTION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(actionClass: ACTION_CLASS): ActionClassMocker<ENTITY, ACTION_CLASS> {
    return new ActionMocker<ActionName, any, any, any>(
      actionClass.actionName,
      this
    ) as ActionClassMocker<ENTITY, ACTION_CLASS>
  }

  received<
    ACTION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(actionClass: ACTION_CLASS): ActionClassResults<ENTITY, ACTION_CLASS> {
    return new CommandResults<unknown, unknown>(
      this[$receivedActions][actionClass.actionName]
    ) as ActionClassResults<ENTITY, ACTION_CLASS>
  }
}
