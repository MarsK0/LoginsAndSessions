import { z } from "zod"

export const FormLogin = z
.object({
  nome: z
    .string()
    .min(4,{
      message: "Usuário inválido!"
    })
    .transform(val => val.toLowerCase())
    .refine( val => val.indexOf(" ") === -1,
      {message: 'Usuário inválido!'}
    ),
  senha: z
    .string()
    .min(8,{
      message: "Senha inválida!"
    })
})

export type TFormLogin = z.infer<typeof FormLogin>