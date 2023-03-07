import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: ' Nhập lại password bắt buộc'
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    //value này là giá trị của confirm_password
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Nhập lại password không khớp'
        : undefined
  }
})

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc ')
    .email('Email không đúng định dạng')
    .min(5, 'Dộ dài từ 5 - 160 ký tự')
    .max(160, 'Dộ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Dộ dài từ 6 - 160 ký tự')
    .max(160, 'Dộ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Dộ dài từ 6 - 160 ký tự')
    .max(160, 'Dộ dài từ 6 - 160 ký tự')
    // oneOf truyền vào array nó chỉ là 1 trong những giá trị này
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp')
})

// Yup khai báo kiểu thế nào thì ta có thể xuất ra một ỉnterface kiểu đó luôn
export type Schema = yup.InferType<typeof schema>

// tao ra 1 schema mới để loại bỏ confirm_password
const loginSchema = schema.omit(['confirm_password'])
type LoginSchema = yup.InferType<typeof loginSchema>
