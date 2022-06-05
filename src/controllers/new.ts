/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler, Router } from "express"
import tokens from "../middlewares/tokens"
import newsService from "../services/news"
const newRouter = Router()

newRouter.get("/", (async (_req, res) => {
  const data = await newsService.getAll()
  res.json(data)
}) as RequestHandler)

newRouter.get("/:id", (async (req, res) => {
  const id = +req.params.id
  const newPopulated = await newsService.getOne(id)
  res.json(newPopulated)
}) as RequestHandler)

newRouter.post("/", tokens.securedEnpoint, async (req, res) => {
  const newAdded = await newsService.add(req.body)
  res.json(newAdded)
})

export default newRouter
