import HttpException from "./HttpException";

class NotFoundException extends HttpException {
  constructor(msg: string) {
    super(404, msg)
  }
}

export default NotFoundException