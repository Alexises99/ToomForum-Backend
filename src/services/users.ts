import { UniqueConstraintError, ValidationError } from "sequelize"
import { NotFoundException, BadRequestException } from "../exceptions"
import { UserEntry, UserEntryWithImage } from "../models/user"
import { User, Image } from "../models"
import * as bcrypt from "bcrypt"

const getUsers = async (): Promise<Array<User>> => {
  const users = await User.findAll()
  return users
}

const getNonSensitiveUserInformation = (users: Array<User> | User) => {
  if (users instanceof Array) {
    return users.map((user) => {
      return {
        username: user.username,
      }
    })
  } else {
    return {
      username: users.username,
    }
  }
}

const getSingleUser = async (username: string): Promise<User> => {
  const user = await User.findByPk(username, {
    attributes: { exclude: ["password"] },
  })

  if (user) {
    return user
  }

  throw new NotFoundException(username)
}

const addUser = async (
  newUserEntry: UserEntryWithImage
): Promise<User | void> => {
  try {
    const saltRounds = 10
    newUserEntry.password = await bcrypt.hash(newUserEntry.password, saltRounds)

    const image = await Image.findByPk(newUserEntry.image_id as number)
    let user
    if (image) {
      user = await User.create({
        ...newUserEntry,
        imageId: image?.id as number,
      })
    } else {
      user = await User.create({ ...newUserEntry })
    }
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

const deleteUser = async (username: string): Promise<boolean> => {
  const user = await getSingleUser(username)
  if (user) {
    await user.destroy()
    return true
  }
  return false
}

const updateUser = async (
  username: string,
  newUserEntry: UserEntry
): Promise<User | null> => {
  const user = await getSingleUser(username)
  if (user) {
    user.password = newUserEntry.password
    await user.save()
    return user
  }
  return null
}

export default {
  getUsers,
  getSingleUser,
  addUser,
  deleteUser,
  updateUser,
  getNonSensitiveUserInformation,
}
