// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { getValidator, ObjectIdSchema, querySyntax, Type } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const takesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    submitted: Type.String(),
    quizID: ObjectIdSchema(),
    createdBy: ObjectIdSchema(),
    updatedBy: Type.Optional(ObjectIdSchema()),
    deletedBy: Type.Optional(ObjectIdSchema())
  },
  { $id: 'Takes', additionalProperties: true }
)
export const takesValidator = getValidator(takesSchema, dataValidator)
export const takesResolver = resolve({})

export const takesExternalResolver = resolve({})

// Schema for creating new entries
export const takesDataSchema = Type.Pick(takesSchema, ['text'], {
  $id: 'TakesData'
})
export const takesDataValidator = getValidator(takesDataSchema, dataValidator)
export const takesDataResolver = resolve({})

// Schema for updating existing entries
export const takesPatchSchema = Type.Partial(takesSchema, {
  $id: 'TakesPatch'
})
export const takesPatchValidator = getValidator(takesPatchSchema, dataValidator)
export const takesPatchResolver = resolve({})

// Schema for allowed query properties
export const takesQueryProperties = Type.Pick(takesSchema, ['_id', 'quizID', 'submitted'])
export const takesQuerySchema = Type.Intersect(
  [
    querySyntax(takesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const takesQueryValidator = getValidator(takesQuerySchema, queryValidator)
export const takesQueryResolver = resolve({})
