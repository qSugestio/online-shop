declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      HOST: string
      USER: string
      PASSWORD: string
      DATABASE: string
      SECRET_KEY: string
    }
  }
}
