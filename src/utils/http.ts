import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import path from 'src/constants/path'
import { AuthResponse } from 'src/types/auth.types'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  setProfileToLocalStorage
} from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string

  // contructor chỉ chạy 1 lần duy nhất
  constructor() {
    // khi nào getApi thì ta cũng lấy data từ trong localstorage ra thì nó sẽ bị chậm. Bởi vì localStorage nó lưu vào trong ổ cứng các bạn nên khi đọc dữ liệu trong ổ cứng lúc nào cũng chậm hơn so với việc đọc dữ liệu trong ram cả. Khi lưu accessToken như này thì nó lưu trên ram. Xét trong localStorage để mỗi lần F5 lại có nếu lưu trên ram thì mất luôn. Nó chỉ lấy ra 1 lần rồi lưu vào accessToken thôi. Sẽ sử dụng accessToken đó ko cần phải lấy từ localStorage ra nữa.
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
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
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data?.access_token
          saveAccessTokenToLocalStorage(this.accessToken)
          setProfileToLocalStorage(data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLocalStorage()
        }

        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data

          // trường hợp data.message không có thì mình lấy error.message
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
