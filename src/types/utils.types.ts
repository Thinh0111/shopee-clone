// là những interface tiện ích

export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// cú pháp `-?` sẽ loại bỏ undefined của key optional
// Này gọi là key optional
// {
//   handle?:
// }

// Này giúp chúng ta loại bỏ undefined trong cái key
export type NoUndefinedField<T> = {
  // NoNullable của typescript sẽ loại bỏ đi giá trị undefined của 1 type
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
