// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('takes service', () => {
  it('registered the service', () => {
    const service = app.service('takes')

    assert.ok(service, 'Registered the service')
  })
})
