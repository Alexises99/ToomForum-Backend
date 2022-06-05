/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import userTestHelper from "../utils/tests/usersTestHelper"
import supertest from "supertest"
import { app } from "../app"
import { NewUser, UserAttributes } from "../models/user"

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

describe("Users tests", () => {
  beforeEach(async () => {
    await userTestHelper.deleteUsers()
    await userTestHelper.createUsers()
  })

  test("can get all users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toEqual(
      expect.arrayContaining(
        userTestHelper.initialUsers.map((user) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          expect.objectContaining({ username: user.username })
        )
      )
    )
  })

  test("can add a new user", async () => {
    const newUser: NewUser = {
      username: "monje",
      password: "sovietmonk",
    }

    const usersAtStart = await userTestHelper.usersInDb()

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await userTestHelper.usersInDb()

    const user = response.body as UserAttributes

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usersAtEnd).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: user.username,
        }),
      ])
    )

    expect(user.username).toEqual(newUser.username)
  })

  test("a user can get the equal user", async () => {
    const user = userTestHelper.initialUsers[0]

    const response = await getToken(user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { token, id } = response.body

    const responseApi = await api
      .get(`/api/users/${id as string}`)
      .set("Authorization", `bearer ${token as string}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    console.log(responseApi.body)
    const { username, image_id } = user
    expect(responseApi.body).toBeDefined()
    expect({ username, image_id }).toMatchObject({
      username: responseApi.body.username as string,
      image_id: responseApi.body.ImageId as string | null,
    })
  })

  test("400 when dont provide params and the valid message", async () => {
    const newUser: Omit<NewUser, "password"> = {
      username: "monje",
    }

    const response = await api.post(`/api/users`).send(newUser).expect(400)

    expect(response.body.message).toBe(
      "Incorrect or missing password undefined"
    )
  })

  test("400 when username is repeated", async () => {
    const user = userTestHelper.initialUsers[0]

    const response = await api.post(`/api/users`).send(user).expect(400)

    expect(response.body.message).toBe("username must be unique")
  })

  test("a user cannot get another user with a different username", async () => {
    const user = userTestHelper.initialUsers[0]
    const userToShow = (await userTestHelper.usersInDb()).at(1)

    const response = await getToken(user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { token } = response.body

    await api
      .get(`/api/users/${userToShow!.id}`)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .set("Authorization", `bearer ${token}`)
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("can delete a user", async () => {
    const user = userTestHelper.initialUsers[0]
    const responseToken = await getToken(user)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { token, id } = responseToken.body

    await api
      .delete(`/api/users/${id as string}`)
      .set("Authorization", `bearer ${token as string}`)
      .expect(204)
  })

  test.only("a different user cannot delete a user", async () => {
    const user = userTestHelper.initialUsers[0]
    const userToShow = (await userTestHelper.usersInDb()).at(2)
    console.log(user)
    console.log(userToShow)
    const responseToken = await getToken(user)

    const token = responseToken.body.token as string

    const response = await api
      .delete(`/api/users/${userToShow!.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(401)

    expect(response.body.message).toBe("not authorized, you are not this user")
  })
})
