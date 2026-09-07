import { Sequelize } from "sequelize";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;

const sequelize = new Sequelize(connectionString, {
  logging: false,
  dialectModule: pg,
  dialectOptions: connectionString.includes("neon.tech") ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  } : {}
});

// module.exports = sequelize
export default sequelize;
