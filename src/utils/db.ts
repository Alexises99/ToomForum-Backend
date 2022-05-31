import { Sequelize } from "sequelize"
import config from "./config"
import * as logger from "./logger"

const sequelize = new Sequelize(config.POSTGREESQL as string, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
})

const connectToDataBase = async (): Promise<null> => {
  try {
    await sequelize.authenticate()
    logger.info("connected to the database")
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`failed to connect to the database ${err}`)
    return process.exit(1)
  }
  return null
}

export { sequelize, connectToDataBase }

/**
 * {
      require: true,
      rejectUnauthorized: false
    }
 */
