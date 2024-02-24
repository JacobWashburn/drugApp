// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  quizesDataValidator,
  quizesPatchValidator,
  quizesQueryValidator,
  quizesResolver,
  quizesExternalResolver,
  quizesDataResolver,
  quizesPatchResolver,
  quizesQueryResolver
} from './quizes.schema.js'
import { QuizesService, getOptions } from './quizes.class.js'

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
      all: [schemaHooks.resolveExternal(quizesExternalResolver), schemaHooks.resolveResult(quizesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(quizesQueryValidator), schemaHooks.resolveQuery(quizesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(quizesDataValidator), schemaHooks.resolveData(quizesDataResolver)],
      patch: [schemaHooks.validateData(quizesPatchValidator), schemaHooks.resolveData(quizesPatchResolver)],
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
