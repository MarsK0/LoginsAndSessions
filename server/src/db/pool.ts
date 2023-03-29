import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config({path: __dirname + "/../../.env"})

const connString: string = `postgres://${process.env.DB_DATABASE_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE_NAME}`

const pool = new Pool({
  connectionString: connString,
  max: 20,
})

export default pool