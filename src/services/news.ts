import { Island, User } from "../models"
import { New, NewNewEntry } from "../models/new"

const getAll = async (): Promise<Array<New>> => {
  const news = await New.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ["password"] },
        include: [Island],
      },
    ],
  })
  return news
}

const getOne = async (id: number): Promise<New | null> => {
  const newObj = New.findByPk(id, {
    include: [
      {
        model: User,
        attributes: { exclude: ["password"] },
        include: [Island],
      },
    ],
  })
  return newObj
}

const add = async (newObj: NewNewEntry): Promise<New> => {
  const newAdded = await New.create(newObj)
  const user = await User.findByPk(newObj.user)
  if (user) {
    await newAdded.setUser(user)
  }
  return newAdded
}

export default {
  getAll,
  getOne,
  add,
}
