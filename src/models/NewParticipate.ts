import { Model, DataTypes } from "sequelize"
import { sequelize } from "../utils/db"

class NewParticipate extends Model {}

NewParticipate.init(
  {
    ended: DataTypes.BOOLEAN,
  },
  {
    sequelize,
  }
)

export { NewParticipate }
