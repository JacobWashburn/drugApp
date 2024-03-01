// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { getOptions, QuizesService } from './quizes.class.js'

export const quizesPath = 'quizes'
export const quizesMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './quizes.class.js'
export * from './quizes.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const quizes = (app) => {
  // Register our service on the Feathers application
  app.use(quizesPath, new QuizesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: quizesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(quizesPath).hooks({
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
