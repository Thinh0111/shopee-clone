import { AxiosError } from 'axios'
/* eslint-disable import/no-named-as-default-member */
import axios from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

// error: unknown là ta chưa biết kiểu error này là gì cả. Sau khi chạy function này thì error chuyển về 1 type nhất định
// Này là những cú pháp type predicate
// if error trả về có kiểu là AxiosError (kiểm tra bằng click vào Prototype có contructor là AxiosError)
// function này trả về kiểu là boolean khi mà function này return true thì error sẽ có kiểu là AxiosError
// khi truyền vào generic type cho AxiosError thì generic type này T này chính là data
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}
