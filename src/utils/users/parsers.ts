/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException } from "../../exceptions"
import { UserWithImage, UserWithIsland } from "../../models/user"
import * as check from "../checkers"

const toNewUser = (object: any): UserWithImage => {
  const toNewUser: UserWithImage = {
    username: parseUsername(object.username),
    password: parsePassword(object.password),
    image_id: parseImageId(object.ImageId),
  }
  return toNewUser
}

const toNewUserWithIsland = (object: any): UserWithIsland => {
  const toNewUser: UserWithIsland = {
    username: parseUsername(object.username),
    password: parsePassword(object.password),
    image_id: parseImageId(object.ImageId),
    islandName: parseIslandName(object.islandName),
    fruit: parseFruit(object.fruit),
    dreamcode: parseDreamcode(object.dreamcode),
  }
  return toNewUser
}

const parseUsername = (username: any): string => {
  if (!username || !check.isString(username)) {
    throw new BadRequestException(`Incorrect or missing username ${username}`)
  }
  return username
}

const parsePassword = (password: any): string => {
  if (!password || !check.isString(password)) {
    throw new BadRequestException(`Incorrect or missing password ${password}`)
  }
  return password
}

const parseImageId = (imageId: any): number | null => {
  if (!imageId || !check.isNumber(imageId)) {
    return null
  }
  return imageId
}

const parseIslandName = (islandName: any): string => {
  if (!islandName || !check.isString(islandName)) {
    throw new BadRequestException(
      `Incorrect or missing islandName ${islandName}`
    )
  }
  return islandName
}

const parseFruit = (fruit: any): string => {
  if (!fruit || !check.isString(fruit)) {
    throw new BadRequestException(`Incorrect or missing fruit ${fruit}`)
  }
  return fruit
}

const parseDreamcode = (dreamcode: any): string => {
  if (!dreamcode || !check.isString(dreamcode)) {
    throw new BadRequestException(
      `Incorrect or missing dream code ${dreamcode}`
    )
  }
  return dreamcode
}

export { toNewUser, toNewUserWithIsland }
