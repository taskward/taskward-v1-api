import { UserInfoModel } from '@/interfaces'

interface LoginResult {
  accessToken: string
  user: UserInfoModel
}

interface SignupResult {
  accessToken: string
  user: UserInfoModel
}

export type { LoginResult, SignupResult }
