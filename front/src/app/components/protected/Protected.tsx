import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const baseUrl = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`

interface Props{
  page: ReactElement,
  modulo: string
}

const Protected: React.FC<Props> = ({ page, modulo })=> {

  const [permissaoUsuario, setPermissaoUsuario] = useState<number>()

  useEffect(()=>{
    verificaPermissao()
  },[])
  
  async function verificaPermissao(){
    try{

      const resultado = await axios.get(`${baseUrl}/permissaomodulo/${modulo}`,{
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
      })
      
      setPermissaoUsuario(resultado.status)
    }catch(erro){

      if(erro instanceof AxiosError){
        if(erro.response?.status === 401){
          setPermissaoUsuario(401)
        }
        if(erro.response?.status === 400){
          setPermissaoUsuario(400)
        }
        return
      }

      console.log(erro)
    }
  }

  if(!permissaoUsuario){
    return null
  }

  if(permissaoUsuario === 200){//status 200 = ok, usuário autorizado
    return <>{page}</>
  }

  return <Navigate to="/login" />
  
}

export default Protected