/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest"
import { app } from "../app"
import userTestHelper from "../utils/tests/usersTestHelper"
import { NewUser } from "../models/user"

const api = supertest(app)

const getToken = async ({
  username,
  password,
}: NewUser): Promise<supertest.Response> => {
  const response: supertest.Response = await api
    .post("/api/login")
    .send({ username, password })
  return response
}

describe("login works properly", () => {
  beforeEach(async () => {
    await userTestHelper.deleteUsers()
    await userTestHelper.createUsers()
  })

  test("Invaled token returns 401 and the valid message", async () => {
    const user = userTestHelper.initialUsers[0]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string
    const id = responseToken.body.id as number

    const response = await api
      .get(`/api/users/${id}`)
      .set("Authorization", `bearer ${token.substring(2)}`)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toBe("invalid token")
  })

  test("Invalid username or password returns 401 and the valid message", async () => {
    const user = userTestHelper.initialUsers[0]
    user.password = "aaaa"

    const response = await api
      .post(`/api/login`)
      .send(user)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toBe("invalid username or password")
  })

  test("a valid user recive one token", async () => {
    const user = userTestHelper.initialUsers[0]
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    const response = await api
      .post(`/api/login`)
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body.token).toBe(token)
  })

  test("missing token throws apropiate erros", async () => {
    const user = (await userTestHelper.usersInDb()).at(0)
    const response = await api
      .get(`/api/users/${user!.id}`)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toBe("Missing token")
  })
})
