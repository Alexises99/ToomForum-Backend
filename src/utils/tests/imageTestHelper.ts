import { Image } from "../../models"
import { NewImage } from "../../models/image"

const initalImage: NewImage = {
  name: "test image",
  data: Buffer.from("this is a test"),
}

const getImagesFromDb = async (): Promise<Array<Image>> => {
  const images = await Image.findAll()
  return images
}

const createImages = async (): Promise<Image> => {
  const image = await Image.create(initalImage)
  return image
}

const deleteImages = async (): Promise<void> => {
  await Image.destroy({
    where: {},
    truncate: false,
  })
}

export default {
  initalImage,
  getImagesFromDb,
  createImages,
  deleteImages,
}
