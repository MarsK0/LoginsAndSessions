import { Router } from "express"
import AdminController from "../controllers/admin.controller"
import UsuarioController from "../controllers/usuario.controller"
import verificaPermissao from "../middlewares/verificaPermissao"

const routes = Router()
const adminController = new AdminController()
const usuarioController = new UsuarioController()

routes.post("/novousuario", verificaPermissao, (req, res) => adminController.cadastrarUsuario(req, res))
routes.post("/login", (req, res) => usuarioController.logaUsuario(req, res))
routes.post("/logout", (req, res) => usuarioController.deslogaUsuario(req, res))
routes.get("/permissaomodulo/:modulo", verificaPermissao, (_req, res) => {return res.status(200).json({message: "Ok"})})


export default routes
