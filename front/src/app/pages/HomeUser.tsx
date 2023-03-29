import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

const baseUrl = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`

const HomeUser: React.FC = () => {

  const navigate = useNavigate()

  async function deslogar(){
    try{
      const login = await axios.post(`${baseUrl}/logout`,{},
      {
        withCredentials: true
      })

      if(login.status === 500){
        alert(login.data.message)
      }

      navigate("/login")
    }catch(erro){

      if(erro instanceof AxiosError){
        if(erro.response?.status === 400){
          alert(erro.response.data.message)
        }
        return
      }

      console.log(erro)
    }
  }

  return(
    <button onClick={deslogar}>
      DESLOGAR
    </button>
  )
}

export default HomeUser