import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"
import { sequelize } from "../utils/db"

interface NewImage {
  name: string
  data: Buffer
}

interface ImageAttributes extends NewImage {
  id: number
}

class Image extends Model<
  InferAttributes<Image>,
  InferCreationAttributes<Image>
> {
  declare id: CreationOptional<number>
  declare data: Buffer
  declare name: string
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false,
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

export { Image, ImageAttributes, NewImage }
