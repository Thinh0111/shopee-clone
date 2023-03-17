import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/api/auth.api'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthResponse, RefreshTokenReponse } from 'src/types/auth.types'
import { ErrorResponse } from 'src/types/utils.types'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage
} from './auth'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

// Có 1 api Purchase nó sẽ bắt đầu từ giây thứ 1 và kết thức từ giấy thứ 3
// Api thứ 2 là api Me(gọi Profile) nó sẽ bắt đầu từ giây thứ 2 và kết thức từ giấy thứ 5
// Purchase lỗi thì nó sẽ gọi lại api Refresh Token cho purchase (sau api Purchase bị lỗi, hết hạn) bắt đầu từ giây thứ 3 và hoàn thành xong tại giây thứ 4
// Gọi lại Purchase tại giây thứ 4 - thứ 6
// Refresh Token mới cho me (sau api Purchase bị lỗi, hết hạn) tại giây thứ 5 và hoàn thành giây tại giây thứ 6
// Gọi lại Me: 6

// do ông Refresh Token trước đó (api purchase) đã thực hiện xong rồi nên xét thành null chỗ  this.refreshTokenRequest = null. Thì nó kiểm tra refreshTokenRequest = null  nên nó tiến hành gọi lại Refresh Token mới (api me)

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  // contructor chỉ chạy 1 lần duy nhất
  constructor() {
    // khi nào getApi thì ta cũng lấy data từ trong localstorage ra thì nó sẽ bị chậm. Bởi vì localStorage nó lưu vào trong ổ cứng các bạn nên khi đọc dữ liệu trong ổ cứng lúc nào cũng chậm hơn so với việc đọc dữ liệu trong ram cả. Khi lưu accessToken như này thì nó lưu trên ram. Xét trong localStorage để mỗi lần F5 lại có nếu lưu trên ram thì mất luôn. Nó chỉ lấy ra 1 lần rồi lưu vào accessToken thôi. Sẽ sử dụng accessToken đó ko cần phải lấy từ localStorage ra nữa.
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',

        // Xét thời gian access_token và refresh_token hết hạn
        'expire-access-token': 60 * 60 * 24, // 1 ngày
        'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        // Vì headers có thể là undefined nên phải check
        if (this.accessToken && config.headers) {
          // ở đây token truyền về đã có chữ 'Bearer' rồi nên chúng ta ko cần phải gán thêm cái chữ này nữa. Đối với 1 số trường hợp server trả về ko có lúc mà nó yêu cầu có phải add thêm 'Bearer'. (Gửi token lên bằng headers với key là authorization.)
          // Nếu có access token thì mình sẽ gán vào header rồi trả về config ko thì trả về config như bình thường
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      (response) => {
        // function bình thường ko thể truy cập đến this, để truy cập đến this thì phải dùng arrow function
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data?.access_token
          this.refreshToken = data.data.refresh_token
          saveAccessTokenToLocalStorage(this.accessToken)
          setRefreshTokenToLocalStorage(this.refreshToken)
          setProfileToLocalStorage(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLocalStorage()
        }

        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          // trường hợp data.message không có thì mình lấy error.message
          const message = data?.message || error.message
          toast.error(message)
        }

        //*
        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // Hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }

          //*
          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          clearLocalStorage()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        saveAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        // Thất bại thường refresh_token hết hạn. Thì cho logout ra (clearLocalStorage)
        clearLocalStorage()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
