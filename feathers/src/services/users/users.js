// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { getOptions, UsersService } from './users.class.js'

export const usersPath = 'users'
export const usersMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './users.class.js'
export * from './users.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const users = (app) => {
  // Register our service on the Feathers application
  app.use(usersPath, new UsersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: usersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(usersPath).hooks({
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
