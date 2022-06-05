import { UniqueConstraintError, ValidationError } from "sequelize"
import { NotFoundException, BadRequestException } from "../exceptions"
import { UserWithImage, UserWithIsland } from "../models/user"
import { User, Image } from "../models"
import * as bcrypt from "bcrypt"

const getUsers = async (): Promise<Array<User>> => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  })
  return users
}

const getSingleUser = async (id: number): Promise<User> => {
  const user = await User.findByPk(id)
  if (user) {
    return user
  }
  throw new NotFoundException(`User with ${id} not found`)
}

const getSingleUserWhitoutPassword = async (
  id: number
): Promise<Omit<User, "password">> => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  })

  if (user) {
    return user
  }

  throw new NotFoundException(`User with ${id} not found`)
}

const addUser = async (newUserEntry: UserWithIsland): Promise<User | void> => {
  try {
    const saltRounds = 10
    newUserEntry.password = await bcrypt.hash(newUserEntry.password, saltRounds)
    const {
      islandName: name,
      fruit,
      dreamcode: dreamCode,
      ...newUser
    } = newUserEntry
    const user = await User.create({
      ...newUser,
    })

    const image = await Image.findByPk(newUserEntry.image_id as number)

    if (image) {
      await user.setImage(image)
    }

    await user.createIsland({ name, fruit, dreamCode })
    return user
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      const msg = err.errors.map((err) => err.message).join(",")
      throw new BadRequestException(msg)
    } else if (err instanceof ValidationError) {
      const msg = err.errors.map((err) => err.message).join(",")
      throw new BadRequestException(msg)
    } else {
      throw new Error()
    }
  }
}

const deleteUser = async (id: number): Promise<boolean> => {
  const user = await getSingleUser(id)
  if (user) {
    await user.destroy()
    return true
  }
  return false
}

const updateUser = async (
  id: number,
  newUserEntry: UserWithImage
): Promise<User | null> => {
  const user = await getSingleUser(id)
  if (user) {
    user.password = newUserEntry.password
    //user.imageId = newUserEntry.image_id
    await user.save()
    return user
  }
  return null
}

export default {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getSingleUserWhitoutPassword,
}
