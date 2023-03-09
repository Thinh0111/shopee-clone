import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { getRules, schema, Schema } from 'src/utils/rules'
import { useMutation } from 'react-query'
import { login } from 'src/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.types'
import { AppContext } from 'src/context/app.context'

// interface FormData {
//   email: string
//   password: string
// }

type FormData = Omit<Schema, 'confirm_password'>
const loginSchema = schema.omit(['confirm_password'])

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  // const rules = getRules()

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              // keyof để lấy key trong object
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  // const onSubmit = handleSubmit(
  //   (data) => {
  //     console.log(data)
  //   },
  //   (data) => {
  //     const password = getValues('password')
  //     console.log(password)
  //   }
  // )

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl '>Đăng Nhập </div>
              <Input
                name='email'
                type='text'
                register={register}
                placeholder='Email'
                className='mt-8'
                errorMessage={errors.email?.message}
                // rules={rules.email}
              />
              <Input
                name='password'
                type='password'
                register={register}
                placeholder='Password'
                className='mt-3'
                errorMessage={errors.password?.message}
                // rules={rules.password}
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
