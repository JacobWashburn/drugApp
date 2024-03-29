// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { hooks as schemaHooks } from '@feathersjs/schema'
import { getOptions, TakesService } from './takes.class.js'
import {
  takesDataResolver,
  takesDataValidator,
  takesExternalResolver,
  takesPatchResolver,
  takesPatchValidator,
  takesQueryResolver,
  takesQueryValidator,
  takesResolver
} from './takes.schema.js'

export const takesPath = 'takes'
export const takesMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './takes.class.js'
export * from './takes.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const takes = (app) => {
  // Register our service on the Feathers application
  app.use(takesPath, new TakesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: takesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(takesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(takesExternalResolver), schemaHooks.resolveResult(takesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(takesQueryValidator), schemaHooks.resolveQuery(takesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(takesDataValidator), schemaHooks.resolveData(takesDataResolver)],
      patch: [schemaHooks.validateData(takesPatchValidator), schemaHooks.resolveData(takesPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    error: {
      all: []
    }
  })
}
