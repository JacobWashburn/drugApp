// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { getValidator, ObjectIdSchema, querySyntax, Type } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const quizesSchema = Type.Object(
  {
    _id: ObjectIdSchema()
  },
  { $id: 'Quizes', additionalProperties: true }
)
export const quizesValidator = getValidator(quizesSchema, dataValidator)
export const quizesResolver = resolve({})

export const quizesExternalResolver = resolve({})

// Schema for creating new entries
export const quizesDataSchema = Type.Pick(quizesSchema, ['text'], {
  $id: 'QuizesData'
})
export const quizesDataValidator = getValidator(quizesDataSchema, dataValidator)
export const quizesDataResolver = resolve({})

// Schema for updating existing entries
export const quizesPatchSchema = Type.Partial(quizesSchema, {
  $id: 'QuizesPatch'
})
export const quizesPatchValidator = getValidator(quizesPatchSchema, dataValidator)
export const quizesPatchResolver = resolve({})

// Schema for allowed query properties
export const quizesQueryProperties = Type.Pick(quizesSchema, ['_id', 'text'])
export const quizesQuerySchema = Type.Intersect(
  [
    querySyntax(quizesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const quizesQueryValidator = getValidator(quizesQuerySchema, queryValidator)
export const quizesQueryResolver = resolve({})
