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

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

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
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',

    // Khi ta return về true trong function test này có nghĩa là nó đã pass qua được bài test của ta. Nó không bị lỗi, còn nếu ta return false trong này thì nó ko pass qua được nó bị lỗi có massage: 'Giá không phù hợp'
    // test: function (value) {
    //   const price_min = value

    //   // this.parent nó sẽ gọi ra object cha của price_min này (cha {price_min, price_max}})
    //   const { price_max } = this.parent as { price_min: string; price_max: string }

    //   // Nếu có giá trị của price_min và price_max
    //   if (price_min !== '' && price_max !== '') {
    //     return Number(price_max) >= Number(price_min)
    //   }

    //   return price_min !== '' || price_max !== ''
    // }
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    // test: function (value) {
    //   const price_max = value
    //   const { price_min } = this.parent as { price_min: string; price_max: string }
    //   if (price_min !== '' && price_max !== '') {
    //     return Number(price_max) >= Number(price_min)
    //   }
    //   return price_min !== '' || price_max !== ''
    // }
    test: testPriceMinMax
  }),
  name: yup.string().required('Tên sản phẩm là bắt buộc').trim()
})

// Yup khai báo kiểu thế nào thì ta có thể xuất ra một ỉnterface kiểu đó luôn
export type Schema = yup.InferType<typeof schema>

// tao ra 1 schema mới để loại bỏ confirm_password
const loginSchema = schema.omit(['confirm_password'])
type LoginSchema = yup.InferType<typeof loginSchema>
