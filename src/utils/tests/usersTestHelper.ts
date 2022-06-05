import { User } from "../../models"
import * as bcrypt from "bcrypt"
import { UserWithImage } from "../../models/user"

const initialUsers: Array<UserWithImage> = [
  {
    username: "elubuntin",
    password: "pinguino",
    image_id: null,
  },
  {
    username: "lowrins",
    password: "tortuga",
    image_id: null,
  },
  {
    username: "ranaldo",
    password: "culero",
    image_id: null,
  },
]

const usersInDb = async (): Promise<Array<User>> => {
  const users = await User.findAll()
  return users
}

const createUsers = (): Promise<Array<User>> => {
  const createdUsers = initialUsers.map(async (user) => {
    const password = await bcrypt.hash(user.password, 10)
    return await User.create({
      username: user.username,
      password,
      imageId: null,
    })
  })

  return Promise.all(createdUsers)
}

const deleteUsers = async (): Promise<void> => {
  await User.destroy({
    where: {},
    truncate: false,
  })
}

export default {
  initialUsers,
  usersInDb,
  createUsers,
  deleteUsers,
}
