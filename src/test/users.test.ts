/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import userTestHelper from '../utils/tests/usersTestHelper'
import supertest from 'supertest'
import { app } from '../app'
import { UserEntry } from '../models/user'

const api = supertest(app)

const getToken = async ({username, password}: UserEntry) => {
  const response = await api
    .post('/api/login')
    .send({username, password})
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response
}

describe('Users tests', () => {

  beforeEach(async () => {
    await userTestHelper.deleteUsers()
    await userTestHelper.createUsers()
  })

  test('can get all users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body).toEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      expect.arrayContaining(userTestHelper.initialUsers.map(user => expect.objectContaining({username: user.username})))
    )
  })

  test('can add a new user', async () => {

    const newUser: UserEntry = {
      username: 'monje',
      password: 'sovietmonk'
    }

    const usersAtStart = await userTestHelper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await userTestHelper.usersInDb()

    const user = response.body as UserEntry

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usersAtEnd).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: user.username
        })
      ])
    )

    expect(user.username).toEqual(newUser.username)
  })

  test('a user can get the equal user', async () => {
    
    const user= userTestHelper.initialUsers[0]

    const response = await getToken(user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = response.body.token

    const responseApi = await api
      .get(`/api/users/${user.username}`)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const {username, image_id: imageId} = user
    expect(responseApi.body).toBeDefined()
    expect({username, imageId}).toMatchObject(responseApi.body)
  })

  test('400 when dont provide params and the valid message', async () => {
    const newUser: Omit<UserEntry, 'password'> = {
      username: 'monje',
    }

    const response = await api
      .post(`/api/users`)
      .send(newUser)
      .expect(400)

    expect(response.body.message).toBe('Incorrect or missing password undefined')
  })

  test('400 when username is repeated', async () => {
    const user= userTestHelper.initialUsers[0]

    const response = await api
      .post(`/api/users`)
      .send(user)
      .expect(400)

    expect(response.body.message).toBe('username must be unique')
  })

  test('a user cannot get another user with a different username', async () => {
    
    const user= userTestHelper.initialUsers[0]
    const userToShow= userTestHelper.initialUsers[1]

    const response = await getToken(user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = response.body.token

    await api
      .get(`/api/users/${userToShow.username}`)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .set('Authorization', `bearer ${token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
  })

  test('can delete a user', async () => {

    const user= userTestHelper.initialUsers[0]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    await api
      .delete(`/api/users/${user.username}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })

  test('a different user cannot delete a user', async () => {

    const user= userTestHelper.initialUsers[0]
    const userToShow = userTestHelper.initialUsers[1]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    const response = await api
      .delete(`/api/users/${userToShow.username}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401)

    expect(response.body.message).toBe('not authorized, you are not this user')
  })

})
