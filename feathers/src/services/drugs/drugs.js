// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  drugsDataValidator,
  drugsPatchValidator,
  drugsQueryValidator,
  drugsResolver,
  drugsExternalResolver,
  drugsDataResolver,
  drugsPatchResolver,
  drugsQueryResolver
} from './drugs.schema.js'
import { DrugsService, getOptions } from './drugs.class.js'

export const drugsPath = 'drugs'
export const drugsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './drugs.class.js'
export * from './drugs.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const drugs = (app) => {
  // Register our service on the Feathers application
  app.use(drugsPath, new DrugsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: drugsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(drugsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(drugsExternalResolver), schemaHooks.resolveResult(drugsResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(drugsQueryValidator), schemaHooks.resolveQuery(drugsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(drugsDataValidator), schemaHooks.resolveData(drugsDataResolver)],
      patch: [schemaHooks.validateData(drugsPatchValidator), schemaHooks.resolveData(drugsPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
