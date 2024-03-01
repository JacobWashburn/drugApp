// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { getOptions, TakesService } from './takes.class.js'

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
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
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
