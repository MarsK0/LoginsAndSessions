declare global {
  namespace NodeJS{
    interface ProcessEnv{
      JWT_SECRET_KEY: string,
      SERVER_PORT: string,
      DB_USER: string,
      DB_PASSWORD: string,
      DB_HOST: string,
      DB_PORT: number,
      DB_DATABASE_NAME: string,
      DB_LOGIN_SCHEMA: string,
    }
  }
}

export{}