declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_KEY: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    TASKWARD_BASE_URL: string
    BRUCE_WORLD_DATABASE_URL: string
    BRUCE_WORLD_SHADOW_DATABASE_URL: string
  }
}
