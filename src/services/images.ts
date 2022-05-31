import { Image } from "../models"
import { ImageType } from "../models/image"

const getOne = async (id: number): Promise<Image | null> => {
  try {
    console.log(id)
    const image = await Image.findByPk(id)
    return image
  } catch (err) {
    console.log(err)
    throw new Error()
  }
}

const create = async ({data, name}: Omit<ImageType, 'id'>): Promise <Image> => {
  try {
    const imageSaved = await Image.create({name, data})
    return imageSaved
  } catch (err) {
    throw new Error()
  }
}

export default {
  getOne,
  create
}