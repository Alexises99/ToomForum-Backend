/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RequestHandler, Router } from "express"
import { type UploadedFile } from "express-fileupload"
import { BadRequestException } from "../exceptions/BadRequest"
import imageService from "../services/images"
import NotFoundException from "../exceptions/NotFound"

const imageRouter = Router()

imageRouter.post("/", (async (req, res, next) => {
  if (!req.files) {
    const err = new BadRequestException("No files were uploaded")
    next(err)
  }
  const image = req.files?.profileImage as UploadedFile
  if (image) {
    const { name, data } = image
    const imageSaved = await imageService.create({ data, name })
    res.status(201).json({ imageId: imageSaved.id })
  }
}) as RequestHandler)

imageRouter.get("/:id", (async (req, res, next) => {
  if (!+req.params.id) {
    console.log("Usuario sin imagen asociada")
    return
  }

  const image = await imageService.getOne(+req.params.id)

  if (image) {
    res.status(200).end(image.data)
  } else {
    next(new NotFoundException(`Image with id: ${req.params.id} not found`))
  }
}) as RequestHandler)

export default imageRouter
