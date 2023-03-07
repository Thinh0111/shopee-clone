import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getRules } from 'src/utils/rules'
import Input from 'src/components/Input'

interface FormData {
  email: string
  password: string
}
const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const rules = getRules()

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data)
    },
    (data) => {
      const password = getValues('password')
      console.log(password)
    }
  )

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl '>Đăng Nhập </div>
              <Input
                name='email'
                type='text'
                register={register}
                placeholder='Email'
                className='mt-8'
                errorMessage={errors.email?.message}
                rules={rules.email}
              />
              <Input
                name='password'
                type='password'
                register={register}
                placeholder='Password'
                className='mt-3'
                errorMessage={errors.password?.message}
                rules={rules.password}
                autoComplete='on'
              />

              {/* Khi khai báo một button trong 1 form mà không điền type cho button thì mặc định button đó có type là submit */}
              <div className='mt-3'>
                <button
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                  type='submit'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
