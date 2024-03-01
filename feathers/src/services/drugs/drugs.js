// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

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
