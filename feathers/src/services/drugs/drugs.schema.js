// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { getValidator, ObjectIdSchema, querySyntax, Type } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const drugsSchema = Type.Object(
  {
    _id: ObjectIdSchema()
  },
  { $id: 'Drugs', additionalProperties: true }
)
export const drugsValidator = getValidator(drugsSchema, dataValidator)
export const drugsResolver = resolve({})

export const drugsExternalResolver = resolve({})

// Schema for creating new entries
export const drugsDataSchema = Type.Pick(drugsSchema, ['text'], {
  $id: 'DrugsData'
})
export const drugsDataValidator = getValidator(drugsDataSchema, dataValidator)
export const drugsDataResolver = resolve({})

// Schema for updating existing entries
export const drugsPatchSchema = Type.Partial(drugsSchema, {
  $id: 'DrugsPatch'
})
export const drugsPatchValidator = getValidator(drugsPatchSchema, dataValidator)
export const drugsPatchResolver = resolve({})

// Schema for allowed query properties
export const drugsQueryProperties = Type.Pick(drugsSchema, ['_id', 'text'])
export const drugsQuerySchema = Type.Intersect(
  [
    querySyntax(drugsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const drugsQueryValidator = getValidator(drugsQuerySchema, queryValidator)
export const drugsQueryResolver = resolve({})
