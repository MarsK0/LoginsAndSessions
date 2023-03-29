import { Request, Response } from "express";
import pool from "../db/pool";
import Usuario from "../models/Usuario";
import geraToken from "../utils/functions/geraToken";
import validacaoUsuario from "../utils/validations/usuario";
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import trataCookies from "../utils/functions/trataCookies";

dotenv.config({path: __dirname + '/../../.env'})

class UsuarioController{

  async logaUsuario(req: Request, res: Response){

    const credenciais = new Usuario(
      req.body.nome,
      req.body.senha
    )

    try{
      validacaoUsuario.parse(credenciais)
    }catch(erro){
      return res.status(400).json({message: "Credenciais inválidas!"})
    }

    try{
      
      const resultado = await pool.query(`SELECT id, tempo_sessao_minutos, ativo, admin FROM ${process.env.DB_LOGIN_SCHEMA}.usuarios WHERE nome='${credenciais.getNome()}' AND senha='${credenciais.getSenha()}'`)
      const idUsuario = resultado.rows[0]?.id ? resultado.rows[0]?.id : null
      
      if(!idUsuario) return res.status(400).json({message: "Credenciais inválidas!"})
      
      const usuarioAtivo = resultado.rows[0]!.ativo

      if(!usuarioAtivo) return res.status(400).json({message: "Credenciais inválidas!"})

      const usuarioAdmin = resultado.rows[0]!.admin

      const tempoSessaoMinutos = resultado.rows[0]!.tempo_sessao_minutos as number

      const userToken = geraToken(idUsuario, tempoSessaoMinutos)

      try{

        await pool.query(`UPDATE ${process.env.DB_LOGIN_SCHEMA}.tokens SET valido = false WHERE id_usuario=${idUsuario}`)
        await pool.query(`INSERT into ${process.env.DB_LOGIN_SCHEMA}.tokens (id_usuario, token) VALUES (${idUsuario}, '${userToken}')`)

      }catch(erro){
        console.log(erro)
        return res.status(500).json({message: 'Erro interno!'})
      }

      res.cookie("userToken", userToken, {
        httpOnly: true,
        sameSite: 'strict'
      })
      
      res.status(200).json({message: 'ok',
                            usuarioAdmin})
    }catch(erro){
      console.log(erro)
      return res.status(500).json({message: 'Erro interno!'})
    }
  }

  async deslogaUsuario(req: Request, res: Response){
    const cookies = req.headers.cookie

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
      return res.status(400).json({message: 'Informações inválidas!'})
    }
      
    try{

      await pool.query(`UPDATE ${process.env.DB_LOGIN_SCHEMA}.tokens SET valido = false WHERE id_usuario=${idUsuario}`)

      res.clearCookie("userToken")

      return res.status(200).json({message: "usuário deslogado com sucesso!"})

    }catch(erro){
      console.log(erro)
      return res.status(500).json({message: "Erro interno!"})
    }

  }
  
}

export default UsuarioController