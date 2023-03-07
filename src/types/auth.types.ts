import { User } from './user.type'
import { ResponseApi } from './utils.types'

// cái auth này sẽ chữa những cái interface những cái type liên quan đến authenticate
export type AuthResponse = ResponseApi<{
  access_token: string
  expire: string
  user: User
}>
