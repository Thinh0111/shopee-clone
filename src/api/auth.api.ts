import { AuthResponse } from 'src/types/auth.types'
import http from 'src/utils/http'

//* C2
const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),
  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),
  logout: () => http.post('/logout')
}

//* C1
// export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)

// export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)

// export const logout = () => http.post('/logout')

export default authApi
