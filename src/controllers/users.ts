import { RequestHandler, Router } from "express"
import usersService from "../services/users"
import { toNewUser, toNewUserWithIsland } from "../utils/users/parsers"
import tokens from "../middlewares/tokens"
import NotAuthorizedException from "../exceptions/NotAuthorized"

const usersRouter = Router()

usersRouter.get("/", (async (_req, res) => {
  const users = await usersService.getUsers()
  res.json(users)
}) as RequestHandler)

usersRouter.post("/", (async (req, res, next) => {
  try {
    const newUserEntry = toNewUserWithIsland(req.body)
    const user = await usersService.addUser(newUserEntry)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}) as RequestHandler)

usersRouter.get("/:id", tokens.getUserFromToken, (async (req, res, next) => {
  try {
    if (req.user?.id === +req.params.id) {
      const user = await usersService.getSingleUserWhitoutPassword(
        +req.params.id
      )
      res.json(user)
    } else {
      next(new NotAuthorizedException("not authorized, you are not this user"))
    }
  } catch (err) {
    next(err)
  }
}) as RequestHandler)

//Borrar entrada en islands
usersRouter.delete("/:id", tokens.getUserFromToken, (async (req, res, next) => {
  try {
    if (req.user?.id === +req.params.id) {
      console.log("holaa")
      await usersService.deleteUser(+req.params.id)
      res.status(204).end()
    } else {
      next(new NotAuthorizedException("not authorized, you are not this user"))
    }
  } catch (err) {
    console.log(err)
  }
}) as RequestHandler)

usersRouter.put("/:username", (async (req, res) => {
  try {
    const user = await usersService.updateUser(
      +req.params.id,
      toNewUser(req.body)
    )
    if (user) {
      res.json(usersService.getSingleUserWhitoutPassword(user.id))
    }
  } catch (err) {
    console.log(err)
  }
}) as RequestHandler)

export default usersRouter
