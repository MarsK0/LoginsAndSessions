import pool from "../db/pool";
import { NextFunction, Request, Response } from "express";
import trataCookies from "../utils/functions/trataCookies";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({path: __dirname + '/../../.env'})

async function verificaPermissao(req: Request, res: Response, next: NextFunction){
  //Trata os cookies da requisição
  const cookies = req.headers.cookie
  const modulo = req.params.modulo

  if(!cookies){
    return res.status(401).json({message: 'Usuário não autorizado!'})
  }

  const tokenCookie = trataCookies(cookies).find((cookie) => cookie.name === 'userToken')

  if(!tokenCookie){
    return res.status(401).json({message: 'Usuário não autorizado!'})
  }

  const userToken = tokenCookie.value

  let idUsuario: number

  try{
    const payload = jwt.verify(userToken, process.env.JWT_SECRET_KEY) as JwtPayload
    idUsuario = payload.id
  }catch(erro){
    res.clearCookie("userToken")
    return res.status(401).json({message: 'Usuário não autorizado!'})
  }

  //verifica validade do token
  try{

    const resultado = await pool.query(`SELECT valido FROM ${process.env.DB_LOGIN_SCHEMA}.tokens WHERE token='${userToken}'`)

    const tokenValido = resultado.rows[0].valido

    if(!tokenValido){

      res.clearCookie("userToken")

      return res.status(401).json({message: "Usuário não autorizado!"})
    } 
  }catch(erro){
    console.log(erro)
    return res.status(500).json({message: "Erro interno1!"})
  }

  //Verifica se usuário está ativo
  try{
    const resultado = await pool.query(`SELECT ativo FROM ${process.env.DB_LOGIN_SCHEMA}.usuarios WHERE id=${idUsuario}`)
    const usuarioAtivo = resultado.rows[0]!.ativo

    if(!usuarioAtivo) return res.status(400).json({message: "Credenciais inválidas!"})

  }catch(erro){
    console.log(erro)
    return res.status(500).json({message: "Erro interno!"})
  }
//Verifica se o usuário é admin antes de checar permissões
let usuarioAdmin: boolean

try{
  const resultado = await pool.query(`SELECT admin FROM ${process.env.DB_LOGIN_SCHEMA}.usuarios WHERE id=${idUsuario}`)
  usuarioAdmin = resultado.rows[0]?.admin ? resultado.rows[0].admin : false
}catch(erro){
  console.log(erro)
  return res.status(500).json({message: "Erro interno!"})
}

if(usuarioAdmin){
  return next()
} 


//Se for redirecionar para a home, não verifica permissão
if(modulo === "home"){
  return next()
}

//Caso não seja admin, verifica a permissão do usuário logado

let idModulo: number | null

try{
  const resultado = await pool.query(`SELECT id FROM ${process.env.DB_LOGIN_SCHEMA}.modulos WHERE modulo='${modulo}'`)
  idModulo = resultado.rows[0]?.id ? resultado.rows[0]?.id : null
}catch(erro){
  console.log(erro)
  return res.status(500).json({message: "Erro interno!"})
}

if(!idModulo) return res.status(400).json({message: "Módulo inexistente!"})

try{
  const resultado = await pool.query(`SELECT id FROM ${process.env.DB_LOGIN_SCHEMA}.permissoes WHERE id_modulos=${idModulo} AND id_usuarios=${idUsuario}`)
  if(resultado.rowCount === 0) return res.status(401).json({message: "Usuário não autorizado!"})

  next()
}catch(erro){
  console.log(erro)
  return res.status(500).json({message: "Erro interno!"})
}

}

export default verificaPermissao