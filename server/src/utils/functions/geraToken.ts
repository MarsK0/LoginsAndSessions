import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({
  path: __dirname + '/../../../.env'
})

function geraToken(id: string, tempoSessaoMinutos: number): string{

  const tempoSessaoSegundos = (tempoSessaoMinutos * 60)

  const payload= {
    id
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: tempoSessaoSegundos 
  })

  return token
}

export default geraToken