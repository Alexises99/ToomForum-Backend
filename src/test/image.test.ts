import imageTestHelper from "../utils/tests/imageTestHelper"
import supertest from "supertest"
import { app } from "../app"
import { NewImage } from "../models/image"

const api = supertest(app)

describe("image test", () => {
  beforeEach(async () => {
    await imageTestHelper.deleteImages()
    await imageTestHelper.createImages()
  })

  test("can get one image", async () => {
    const images = await imageTestHelper.getImagesFromDb()
    const image = images[0]

    const response = await api.get(`/api/images/${image.id}`).expect(200)

    expect(response.body).toBeDefined()
  })

  test.skip("cand add a new image", async () => {
    const imageToAdd: NewImage = {
      name: "hola",
      data: Buffer.from("holaaa"),
    }

    const response = await api.post("/api/images").send(imageToAdd).expect(201)

    expect(response.body).toEqual(imageToAdd)
  })
})
