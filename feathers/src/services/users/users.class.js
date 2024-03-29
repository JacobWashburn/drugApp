import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class UsersService extends MongoDBService {}

export const getOptions = (app) => {
  let Model = app.get('mongodbClient').then((db) => {
    db.collection('users').createIndex({ email: 1 }, { unique: true })
    db.collection('users').createIndex({ username: 1 }, { unique: true })
    return db.collection('users')
  })
  return {
    paginate: app.get('paginate'),
    Model
  }
}
