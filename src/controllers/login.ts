import { RequestHandler, Router } from "express"
import { User } from "../models"
import { toNewUser } from "../utils/users/parsers"
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../utils/config'
import { UserEntryWithImage } from "../models/user"
import NotAuthorizedException from "../exceptions/NotAuthorized"

const loginRouter = Router()

loginRouter.post('/', (async (req,res, next) => {
  const body = toNewUser(req.body)

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.password)
  
  if (!(passwordCorrect && user)) {
    next(new NotAuthorizedException('invalid username or password'))
    return
  }

  const userForToken: Omit<UserEntryWithImage, 'password'> = {
    username: user.username,
    image_id: user.imageId
  }

  const username = userForToken.username
  const imageId = userForToken.image_id

  const token = jwt.sign(userForToken, config.SECRET as jwt.Secret)
  return res
    .status(200)
    .json({token, username, imageId})
}) as RequestHandler)

export default loginRouter