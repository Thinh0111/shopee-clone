import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { getRules, schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import { registerAccount } from 'src/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.types'
import { AppContext } from 'src/context/app.context'
import { useContext } from 'react'

type FormData = Schema
const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()

  // const rules = getRules(getValues)

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              // keyof để lấy key trong object
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl '>Đăng Ký</div>
              <div className='mt-8'>
                {/* Nếu để có name thì nó sẽ override cái name */}
                {/* <input
                  type='text'
                  // name='email'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Email'
                  {...register('email', rules.email)}
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors.email?.message}</div> */}

                <Input
                  name='email'
                  type='text'
                  register={register}
                  placeholder='Email'
                  className='mt-8'
                  errorMessage={errors.email?.message}
                  // rules={rules.email}
                />
              </div>
              <Input
                name='password'
                type='password'
                register={register}
                placeholder='Password'
                className='mt-2'
                errorMessage={errors.password?.message}
                // rules={rules.password}
                autoComplete='on'
              />
              <Input
                name='confirm_password'
                type='password'
                register={register}
                placeholder='Confirm Password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                // rules={rules.confirm_password}
                autoComplete='on'
              />

              {/* <div className='mt-2'>
                <input
                  type='password'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Confirm Password'
                  autoComplete='on'
                  {...register('confirm_password', {
                    ...rules.confirm_password
                    // validate: (value) => {
                    //   //value này là giá trị của confirm_password
                    //   if (value === getValues('password')) {
                    //     return true
                    //   }
                    //   return 'Nhập lại password không khớp'
                    // }
                  })}
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors.confirm_password?.message}</div>
              </div> */}
              <div className='mt-2'>
                <button
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                  type='submit'
                >
                  Đăng ký
                </button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
