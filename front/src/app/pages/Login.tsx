import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TFormLogin, FormLogin } from '../utils/validations/login';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const baseUrl = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        MarsK0
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const Login: React.FC = () => {

  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TFormLogin>({
    resolver: zodResolver(FormLogin)
  })

  async function handleLogin({nome, senha}: TFormLogin){
    try{
      const login = await axios.post(`${baseUrl}/login`,{
        nome: nome,
        senha: senha
      },
      {
        withCredentials: true
      })
  
      if(login.status === 200){

        login.data.usuarioAdmin ? navigate("/admin") : navigate("/")

      }
  
      if(login.status === 500){
        alert("Erro na tentativa de login!")
      }
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

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Usuário"
              autoComplete="nome"
              autoFocus
              error={!!errors.nome}
              helperText={errors.nome?.message}
              {...register("nome")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              error={!!errors.senha}
              helperText={errors.senha?.message}
              {...register("senha")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={ isSubmitting }
            >
              Entrar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Login