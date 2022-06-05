import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"
import { sequelize } from "../utils/db"

interface IslandEntry {
  username: string
  fruit: string
  dreamCode: string | null
  name: string
  imagen: number
}

class Island extends Model<
  InferAttributes<Island>,
  InferCreationAttributes<Island>
> {
  declare id: CreationOptional<number>
  declare fruit: string
  declare dreamCode: string | null
  declare name: string
}

Island.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fruit: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dreamCode: {
      type: DataTypes.TEXT,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

export { Island, IslandEntry }
