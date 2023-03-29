import express from 'express'
import dotenv from 'dotenv'
import routes from './src/routes/routes'
import cors from 'cors'

dotenv.config({
  path: __dirname + "/.env"
})

const server = express()
server.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}))
server.use(express.json())
server.use(routes)

server.listen(process.env.SERVER_PORT, ()=>{
  console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`)
})