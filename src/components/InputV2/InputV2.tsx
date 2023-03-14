import React, { forwardRef, useState } from 'react'
import { InputHTMLAttributes } from 'react'
import { useForm, useController, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
}

// useControllerProps kế thừa InputNumberProps (&)
function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  // field này nó xuất cho chúng ta cái value
  const { field, fieldState } = useController(props)

  const {
    type,
    onChange,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1rem] text-sm text-red-600',
    value = '',
    ...rest
  } = props

  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = e.target.value
    const numberCondition = type === 'number' && (/^\d*$/.test(valueFromInput) || valueFromInput === '')

    if (numberCondition || type !== 'number') {
      // cập nhật localValue (trừ trường trường hợp người dùng ko nhập gì vào thì component vẫn chạy đúng)
      setLocalValue(valueFromInput)

      // Gọi field.onChange để cập nhật vào state React-hook-form
      field.onChange(e)

      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(e)
    }
  }
  return (
    <>
      {/* Nếu người ta truyền value thì lấy value ko thì lấy localValue */}
      {/* khi sử dụng {...rest} {...field} phải đưa lên đầu onChange và value, để onChange và value nó override, vì trong {...field} có onChange */}
      <div className={className}>
        <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
        <div className={classNameError}>{fieldState.error?.message}</div>
      </div>
    </>
  )
}

export default InputV2
