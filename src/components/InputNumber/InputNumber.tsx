import React, { forwardRef } from 'react'
import { InputHTMLAttributes } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1rem] text-sm text-red-600',
    onChange,
    ...rest
  },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    // reges kiểm tra số
    if ((/^\d*$/.test(value) || value === '') && onChange) {
      // Khi nhập số thì onChange mới chạy, còn nhập text thì onChange sẽ không chạy
      // bên này xuất ra event bên nhận sẽ nhận event, bên này xuất ra value bên nhận sẽ nhận value
      onChange(e)
    }
  }
  return (
    <>
      <div className={className}>
        <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </>
  )
})

export default InputNumber
