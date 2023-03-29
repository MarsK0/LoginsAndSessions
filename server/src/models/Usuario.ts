class Usuario{
  constructor(
    private nome: string,
    private senha: string
  ){}

  getNome():string {
    return this.nome
  }

  getSenha():string {
    return this.senha
  }
}

export default Usuario