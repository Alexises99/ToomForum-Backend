import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  CreationOptional,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize"
import { sequelize } from "../utils/db"
import { Image } from "./image"
import { Island } from "./island"

interface NewUser {
  username: string
  password: string
}

interface UserWithImage extends NewUser {
  image_id: number | null
}

interface UserAttributes extends UserWithImage {
  id: number
}

interface UserWithIsland extends UserWithImage {
  islandName: string
  fruit: string
  dreamcode: string
}

type NonSensitiveInfo = Omit<UserWithImage, "password">

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare imageId: ForeignKey<Image["id"]> | null

  declare createImage: HasOneCreateAssociationMixin<Image>
  declare getImage: HasOneGetAssociationMixin<Image>
  declare setImage: HasOneSetAssociationMixin<Image, "id">

  declare createIsland: HasOneCreateAssociationMixin<Island>
  declare getIsland: HasOneGetAssociationMixin<Island>
  declare setIsland: HasOneSetAssociationMixin<Island, "id">
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

export {
  User,
  NonSensitiveInfo,
  NewUser,
  UserWithImage,
  UserAttributes,
  UserWithIsland,
}
