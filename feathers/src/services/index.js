import { takes } from './takes/takes.js'

import { quizes } from './quizes/quizes.js'

import { drugs } from './drugs/drugs.js'

import { users } from './users/users.js'

export const services = (app) => {
  app.configure(takes)

  app.configure(quizes)

  app.configure(drugs)

  app.configure(users)

  // All services will be registered here
}
