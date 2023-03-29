import { z } from 'zod'

const validacaoUsuario = z.object({
  nome: z
    .string()
    .regex(new RegExp('^[a-z_]*$')),
  senha: z
    .string()
})

export default validacaoUsuario