module.exports = {
  host: 'localhost',
  port: 3030,
  public: './public/',
  origins: ['http://localhost:3030'],
  paginate: {
    default: 5000,
    max: 5000
  },
  mongodb:
    'mongodb://127.0.0.1:27017/local',
  authentication: {
    entity: 'users',
    service: 'users',
    secret: 'tMv0Oa5unXFA5U8648IEBeAyAiBt0YHK',
    authStrategies: ['jwt', 'local'],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: 'https://yourdomain.com',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: {
      usernameField: 'email',
      passwordField: 'password'
    }
  }
}
