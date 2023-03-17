import { User } from './user.type'
import { SuccessResponse } from './utils.types'

// cái auth này sẽ chữa những cái interface những cái type liên quan đến authenticate
export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
