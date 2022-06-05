import { NextFunction, Response, Request } from "express"
import HttpException from "../exceptions/HttpException"
//import { error } from "../utils/logger"

const errorHandler = (
  err: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500
  const message = err.message || "Someting went wrong"

  //error(message)

  res.status(status).json({
    status,
    message,
  })

  next(err)
}

export default errorHandler
