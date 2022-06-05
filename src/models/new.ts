import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize"
import { sequelize } from "../utils/db"
import { User } from "./user"

interface NewEntry {
  id: number
  price: number
  startHour: string
  endHour: string
  user: number
}

type NewNewEntry = Omit<NewEntry, "id">

class New extends Model<InferAttributes<New>, InferCreationAttributes<New>> {
  declare id: CreationOptional<number>
  declare price: number
  declare endHour: string
  declare startHour: string
  declare user: ForeignKey<User["id"]>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare createUser: HasOneCreateAssociationMixin<User>
  declare getUser: HasOneGetAssociationMixin<User>
  declare setUser: HasOneSetAssociationMixin<User, "id">
}

New.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startHour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endHour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
  }
)

export { NewNewEntry, NewEntry, New }
