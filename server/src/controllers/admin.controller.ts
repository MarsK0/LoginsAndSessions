import { Request, Response } from "express";
import pool from "../db/pool";
import Usuario from "../models/Usuario";
import validacaoUsuario from "../utils/validations/usuario";
import dotenv from "dotenv"

dotenv.config({path: __dirname + "/../../.env"})

class AdminController{
  
async cadastrarUsuario(req: Request, res: Response){
    const novoUsuario = new Usuario(
      req.body.nome, 
      req.body.senha
    )

    try{
      validacaoUsuario.parse(novoUsuario)
    }catch(erro){
      console.log(erro)
      return res.status(400).json({message: 'Informações inválidas!'})
    }

    try{
      const resultado = await pool.query(`SELECT id FROM ${process.env.DB_LOGIN_SCHEMA}.usuarios WHERE nome='${novoUsuario.getNome()}'`)
      const usuarioCadastrado = resultado.rowCount

      if(usuarioCadastrado) return res.status(409).json({message: "Usuário já cadastrado!"})
    }catch(erro){
      console.log(erro)
      return res.status(500).json({message: "Erro interno!"})
    }

    try{
      await pool.query(`INSERT INTO ${process.env.DB_LOGIN_SCHEMA}.usuarios (nome, senha) VALUES ('${novoUsuario.getNome()}','${novoUsuario.getSenha()}')`)
      return res.status(201).json({message: `${novoUsuario.getNome()} cadastrado!`})
    }catch(erro){
      console.log(erro)
      return res.status(500).json({message: "Erro interno!"})
    }
}
  
}

export default AdminController