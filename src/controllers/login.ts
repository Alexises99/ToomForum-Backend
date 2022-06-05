import { RequestHandler, Router } from "express"
import { User } from "../models"
import { toNewUser } from "../utils/users/parsers"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../utils/config"
import { UserAttributes } from "../models/user"
import NotAuthorizedException from "../exceptions/NotAuthorized"

const loginRouter = Router()

loginRouter.post("/", (async (req, res, next) => {
  const body = toNewUser(req.body)

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const image = await user?.getImage()

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password)

  if (!(passwordCorrect && user)) {
    next(new NotAuthorizedException("invalid username or password"))
    return
  }

  const userForToken: Omit<UserAttributes, "password"> = {
    id: user.id,
    username: user.username,
    image_id: image?.id as number | null,
  }

  const { id, username, image_id } = userForToken

  const token = jwt.sign(userForToken, config.SECRET as jwt.Secret)
  return res.status(200).json({ token, username, ImageId: image_id, id })
}) as RequestHandler)

export default loginRouter
