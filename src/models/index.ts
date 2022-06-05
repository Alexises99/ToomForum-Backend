import { Image } from "./image"
import { Island } from "./island"
import { New } from "./new"
import { NewParticipate } from "./NewParticipate"
import { User } from "./user"

Image.hasOne(User)
User.belongsTo(Image)

Image.hasOne(Island)
Island.belongsTo(Image)

User.hasOne(Island)
Island.belongsTo(User)

User.hasOne(New)
New.belongsTo(User)

New.belongsToMany(User, { through: "NewParticipate" })
User.belongsToMany(New, { through: "NewParticipate" })

const config = async (): Promise<void> => {
  await Image.sync({ alter: true })
  await User.sync({ alter: true })
  await Island.sync({ alter: true })
  await New.sync({ alter: true })
  void NewParticipate.sync({ alter: true })
}

void config()

export { Image, User, Island, New }
