import { AxiosError } from 'axios'
/* eslint-disable import/no-named-as-default-member */
import axios from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

// error: unknown là ta chưa biết kiểu error này là gì cả. Sau khi chạy function này thì error chuyển về 1 type nhất định
// Này là những cú pháp type predicate
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
