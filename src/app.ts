import express from "express"
import cors from "cors"
import usersRouter from "./controllers/users"
import loginRouter from "./controllers/login"
import imageRouter from "./controllers/images"
import newRouter from "./controllers/new"
import errorHandler from "./middlewares/errorHandler"
import middlewareToken from "./middlewares/tokens"
import fileUpload from "express-fileupload"

const app = express()

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(fileUpload())

app.use(middlewareToken.tokenExtractor)

app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/images", imageRouter)
app.use("/api/news", newRouter)

app.use(errorHandler)

export { app }
