/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from 'supertest'
import { app } from '../app'
import userTestHelper from '../utils/tests/usersTestHelper'
import { UserEntry } from '../models/user'

const api = supertest(app)

const getToken = async ({username, password}: UserEntry) => {
  const response = await api
    .post('/api/login')
    .send({username, password})
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response
}

describe('login works properly', () => {
  beforeEach(async () => {
    await userTestHelper.deleteUsers()
    await userTestHelper.createUsers()
  })
  
  test('Invaled token returns 401 and the valid message', async () => {
    const user= userTestHelper.initialUsers[0]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    const response = await api
      .get(`/api/users/${user.username}`)
      .set('Authorization', `bearer ${token.substring(2)}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.message).toBe('invalid token')
  })

  test('Invalid username or password returns 401 and the valid message', async () => {
    const user= userTestHelper.initialUsers[0]
    user.password = 'aaaa'

    const response = await api
      .post(`/api/login`)
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    
    expect(response.body.message).toBe('invalid username or password')
  })

  test('a valid user recive token', async () => {
    const user= userTestHelper.initialUsers[2]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    const response = await api
      .post(`/api/login`)
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBe(token)
  })

  test('missing token throws apropiate erros', async () => {

    const response = await api
      .get(`/api/users/ubuntin`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.message).toBe('Missing token')
  })
})
