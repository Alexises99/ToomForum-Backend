import { Image } from "../models"
import { NewImage } from "../models/image"

const getOne = async (id: number): Promise<Image | null> => {
  try {
    const image = await Image.findByPk(id)
    return image
  } catch (err) {
    console.log(err)
    throw new Error()
  }
}

const create = async ({ data, name }: NewImage): Promise<Image> => {
  try {
    const imageSaved = await Image.create({ name, data })
    return imageSaved
  } catch (err) {
    throw new Error()
  }
}

export default {
  getOne,
  create,
}
